import { Router, Request, Response } from "express";
import passport from "passport";
import { getSamlStrategy } from "./saml-strategy";
import { upsertUser } from "./db";

const router = Router();

// Initialize SAML strategy
const samlStrategy = getSamlStrategy();
passport.use("saml", samlStrategy);

// Serialize/deserialize user for sessions
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});

/**
 * GET /auth/saml/metadata
 * Expose SAML metadata for IdP configuration
 */
router.get("/metadata", (req: Request, res: Response) => {
  const metadata = samlStrategy.generateServiceProviderMetadata(
    req.protocol + "://" + req.get("host") + "/api/auth/saml/acs",
    req.protocol + "://" + req.get("host") + "/api/auth/saml/acs"
  );
  res.type("application/xml").send(metadata);
});

/**
 * POST /auth/saml/login
 * Initiate SAML authentication
 */
router.post(
  "/login",
  passport.authenticate("saml", { failureRedirect: "/login" }),
  (req: Request, res: Response) => {
    res.redirect("/");
  }
);

/**
 * POST /auth/saml/acs
 * Assertion Consumer Service - receive SAML response from IdP
 */
router.post(
  "/acs",
  passport.authenticate("saml", { failureRedirect: "/login" }),
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user as any;

      // Extract SAML attributes
      const samlProfile = {
        openId: user.nameID || user.uid || user.email,
        email: user.email || user.mail,
        name: user.name || user.cn || "SPID User",
        phoneNumber: user.mobilePhone || user.telephoneNumber,
        loginMethod: "spid",
      };

      // Upsert user to database
      await upsertUser({
        openId: samlProfile.openId,
        email: samlProfile.email,
        name: samlProfile.name,
        loginMethod: samlProfile.loginMethod,
      });

      // Redirect to verification complete page
      res.redirect("/?verified=true&method=spid");
    } catch (error) {
      console.error("[SAML ACS Error]", error);
      res.redirect("/login?error=saml_failed");
    }
  }
);

/**
 * GET /auth/saml/logout
 * Initiate SAML logout
 */
router.get("/logout", (req: Request, res: Response) => {
  (req as any).logout((err: any) => {
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

/**
 * POST /auth/saml/sls
 * Single Logout Service - receive logout response from IdP
 */
router.post("/sls", (req: Request, res: Response) => {
  (req as any).logout((err: any) => {
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

export default router;
