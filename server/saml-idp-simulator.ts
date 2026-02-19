import express from "express";
import { readFileSync } from "fs";

const router = express.Router();

// Load certificates
const privateKey = readFileSync("/home/ubuntu/trustnest/certs/private.key", "utf-8");
const certificate = readFileSync("/home/ubuntu/trustnest/certs/certificate.crt", "utf-8");

/**
 * GET /idp/sso
 * SAML Single Sign-On endpoint - redirects to login
 */
router.get("/sso", (req, res) => {
  const relayState = req.query.RelayState || "";
  const samlRequest = req.query.SAMLRequest || "";

  // Redirect to login page
  res.redirect(
    `/idp/login?RelayState=${encodeURIComponent(relayState as string)}&SAMLRequest=${encodeURIComponent(samlRequest as string)}`
  );
});

/**
 * GET /idp/login
 * Login form
 */
router.get("/login", (req, res) => {
  const relayState = req.query.RelayState || "";
  const samlRequest = req.query.SAMLRequest || "";

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>SAML IdP Test Login</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 400px; margin: 50px auto; background: white; padding: 20px; border-radius: 8px; }
        h1 { color: #333; }
        .form-group { margin: 15px 0; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
        button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .test-users { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        .test-users p { margin: 5px 0; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>SAML IdP Test</h1>
        <form method="POST" action="/idp/acs">
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <input type="hidden" name="RelayState" value="${relayState}">
          <input type="hidden" name="SAMLRequest" value="${samlRequest}">
          <button type="submit">Login</button>
        </form>
        
        <div class="test-users">
          <p><strong>Test Users:</strong></p>
          <p>user1 / password</p>
          <p>user2 / password</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

/**
 * POST /idp/acs
 * Assertion Consumer Service - process login and send SAML response
 */
router.post("/acs", (req, res) => {
  const { username, password, RelayState, SAMLRequest } = req.body;

  // Simple authentication
  const users: Record<string, any> = {
    user1: {
      email: "user1@example.com",
      name: "User One",
      uid: "user1",
      mobilePhone: "+39 333 1234567",
    },
    user2: {
      email: "user2@example.com",
      name: "User Two",
      uid: "user2",
      mobilePhone: "+39 333 7654321",
    },
  };

  if (!users[username] || password !== "password") {
    return res.status(401).send("Invalid credentials");
  }

  const user = users[username];

  // Generate SAML Response
  const now = new Date();
  const notOnOrAfter = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  const samlResponse = `<?xml version="1.0" encoding="UTF-8"?>
<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
                xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
                ID="_${generateId()}"
                Version="2.0"
                IssueInstant="${now.toISOString()}"
                Destination="http://localhost:3000/api/auth/saml/acs">
  <saml:Issuer>http://localhost:8001/idp</saml:Issuer>
  <samlp:Status>
    <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
  </samlp:Status>
  <saml:Assertion xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xmlns:xs="http://www.w3.org/2001/XMLSchema"
                  ID="_${generateId()}"
                  Version="2.0"
                  IssueInstant="${now.toISOString()}">
    <saml:Issuer>http://localhost:8001/idp</saml:Issuer>
    <saml:Subject>
      <saml:NameID Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress">${user.email}</saml:NameID>
      <saml:SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
        <saml:SubjectConfirmationData NotOnOrAfter="${notOnOrAfter.toISOString()}" Recipient="http://localhost:3000/api/auth/saml/acs"/>
      </saml:SubjectConfirmation>
    </saml:Subject>
    <saml:Conditions NotBefore="${now.toISOString()}" NotOnOrAfter="${notOnOrAfter.toISOString()}">
      <saml:AudienceRestriction>
        <saml:Audience>http://localhost:3000</saml:Audience>
      </saml:AudienceRestriction>
    </saml:Conditions>
    <saml:AuthnStatement AuthnInstant="${now.toISOString()}" SessionIndex="_${generateId()}">
      <saml:AuthnContext>
        <saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:Password</saml:AuthnContextClassRef>
      </saml:AuthnContext>
    </saml:AuthnStatement>
    <saml:AttributeStatement>
      <saml:Attribute Name="email" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xsi:type="xs:string">${user.email}</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="name" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xsi:type="xs:string">${user.name}</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="uid" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xsi:type="xs:string">${user.uid}</saml:AttributeValue>
      </saml:Attribute>
      <saml:Attribute Name="mobilePhone" NameFormat="urn:oasis:names:tc:SAML:2.0:attrname-format:basic">
        <saml:AttributeValue xsi:type="xs:string">${user.mobilePhone}</saml:AttributeValue>
      </saml:Attribute>
    </saml:AttributeStatement>
  </saml:Assertion>
</samlp:Response>`;

  // Sign the response
  const signedResponse = signXml(samlResponse, privateKey);

  // Encode response
  const encodedResponse = Buffer.from(signedResponse).toString("base64");

  // Return form with SAML response
  res.send(`
    <!DOCTYPE html>
    <html>
    <body onload="document.forms[0].submit()">
      <form method="POST" action="http://localhost:3000/api/auth/saml/acs">
        <input type="hidden" name="SAMLResponse" value="${encodedResponse}">
        <input type="hidden" name="RelayState" value="${RelayState || ""}">
        <noscript>
          <button type="submit">Click here to continue</button>
        </noscript>
      </form>
    </body>
    </html>
  `);
});

/**
 * GET /idp/metadata
 * SAML IdP metadata
 */
router.get("/metadata", (req, res) => {
  const metadata = `<?xml version="1.0" encoding="UTF-8"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://localhost:8001/idp">
  <IDPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <KeyDescriptor use="signing">
      <KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#">
        <X509Data>
          <X509Certificate>${certificate.replace(/-----BEGIN CERTIFICATE-----\n?/, "").replace(/\n?-----END CERTIFICATE-----/, "")}</X509Certificate>
        </X509Data>
      </KeyInfo>
    </KeyDescriptor>
    <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="http://localhost:8001/idp/sso"/>
    <SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="http://localhost:8001/idp/logout"/>
  </IDPSSODescriptor>
</EntityDescriptor>`;

  res.type("application/xml").send(metadata);
});

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function signXml(xml: string, privateKey: string): string {
  // For testing purposes, return unsigned XML
  // In production, use xml-crypto to sign properly
  return xml;
}

export default router;
