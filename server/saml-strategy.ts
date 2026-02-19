/**
 * Passport SAML Strategy for SPID/CIE Authentication
 * Configures Passport.js to handle SAML 2.0 authentication with Italian eID providers
 */

import { Strategy as SamlStrategy } from "passport-saml";

export interface SamlProfile {
  nameID: string;
  nameIDFormat: string;
  sessionIndex: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  fiscalNumber?: string;
  idProvider?: string;
}

/**
 * Create SAML strategy for development (with test IdP)
 */
export function createDevSamlStrategy() {
  return new SamlStrategy(
    {
      path: "/api/auth/saml/acs",
      entryPoint: process.env.SAML_ENTRY_POINT || "http://localhost:8000/idp/profile/SAML2/Redirect/SSO",
      issuer: process.env.SAML_ISSUER || "trustnest",
      cert: process.env.SAML_CERT || "test",
      identifierFormat: "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
    },
    (profile: any, done: (err: Error | null, user?: any) => void) => {
      // Verify user exists or create new user from SAML profile
      return done(null, profile);
    }
  );
}

/**
 * Create SAML strategy for production (with real SPID/CIE providers)
 */
export function createProdSamlStrategy() {
  const fs = require("fs");
  const path = require("path");

  // Load certificates from environment or files
  const privateKey = process.env.SAML_PRIVATE_KEY || fs.readFileSync(path.join(process.cwd(), "certs/private.key"), "utf8");
  const certificate = process.env.SAML_CERTIFICATE || fs.readFileSync(path.join(process.cwd(), "certs/certificate.crt"), "utf8");
  const idpCert = process.env.SAML_IDP_CERT || fs.readFileSync(path.join(process.cwd(), "certs/idp-cert.crt"), "utf8");

  return new SamlStrategy(
    {
      path: "/api/auth/saml/acs",
      entryPoint: process.env.SAML_ENTRY_POINT!,
      issuer: process.env.SAML_ISSUER!,
      cert: idpCert,
      privateKey: privateKey,
      identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
    },
    (profile: any, done: (err: Error | null, user?: any) => void) => {
      return done(null, profile);
    }
  );
}

/**
 * Get SAML strategy based on environment
 */
export function getSamlStrategy() {
  if (process.env.NODE_ENV === "production") {
    return createProdSamlStrategy();
  }
  return createDevSamlStrategy();
}

/**
 * Generate SAML metadata for Service Provider registration
 */
export function generateMetadata(appUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="trustnest">
  <SPSSODescriptor AuthnRequestsSigned="true" WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>YOUR_CERTIFICATE_HERE</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
    <NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</NameIDFormat>
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="${appUrl}/api/auth/saml/logout"/>
    <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="${appUrl}/api/auth/saml/acs" index="0" isDefault="true"/>
  </SPSSODescriptor>
</EntityDescriptor>`;
}
