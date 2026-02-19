# TrustNest MVP - Phase 1 TODO

## Core Infrastructure
- [x] Database schema design (users, profiles, properties, messages, verifications, documents)
- [x] tRPC routers structure planning
- [x] Storage S3 integration for documents
- [ ] Real-time messaging setup (WebSocket/Socket.io)
- [ ] Environment variables and secrets configuration

## Authentication & User Management
- [x] Manus OAuth integration and session management
- [ ] User role toggle (tenant/landlord) - UI implementation in registration/profile
- [x] User profile creation and editing
- [x] Profile fields: age, budget range, work type, sleep schedule, cleanliness level, smoking/drinking, pets
- [ ] Role-specific profile fields (landlord: company info, bank details; tenant: employment info)

## Identity Verification System
- [x] Government ID upload and storage
- [x] Selfie + liveness detection integration
- [x] Phone number verification (OTP)
- [x] Email verification
- [x] Trust badge system (Verified/Not Verified binary)
- [x] Verification status tracking in user profiles
- [x] Document encryption and GDPR-compliant storage
- [x] Verification Dashboard UI - step-by-step verification flow
- [x] eID integration (SPID, CIE, eIDAS) - mock implementation
- [x] Automatic verification completion via eID login
- [x] Support for multiple national eID providers
- [ ] Landlord-specific verification (property deed, company registration)
- [ ] Tenant-specific verification (employment letter, income proof)
- [ ] Admin verification review interface

## Property Listing System
- [x] Property model and database schema
- [x] Property creation form (title, description, price, location, photos)
- [x] Photo upload and storage
- [ ] Property listing page with public view
- [ ] Search functionality
- [ ] Basic filters (price range, location, amenities)
- [ ] Property detail view

## Roommate Matching Engine
- [x] Matching algorithm with weighted scoring
- [x] Compatibility calculation (budget, sleep schedule, cleanliness, smoking/drinking, pets)
- [ ] Match percentage display
- [ ] Match explanation/reasoning display
- [ ] User preference questionnaire

## Messaging System
- [x] Message model and database schema
- [x] One-to-one messaging between users
- [ ] Conversation list view
- [ ] Real-time message delivery
- [x] Message history
- [ ] Unread message indicators

## Admin Dashboard
- [x] Admin role and access control
- [x] Admin dashboard layout with sidebar navigation
- [x] Document review interface with image viewer
- [x] Verification approval/rejection workflow
- [x] Verification queue with filters and sorting
- [x] User management and moderation
- [x] Verification statistics and overview
- [x] Audit logging and activity history
- [x] Trust badge management
- [x] Fraud detection and risk flags

## UI & Design
- [x] Nordic design system (colors, typography, spacing)
- [x] Landing page with value proposition
- [x] Sign up / Log in pages (via Manus OAuth)
- [x] Verification dashboard
- [x] Property listing pages
- [x] Matching interface
- [x] Messaging UI
- [x] User profile pages
- [x] Admin dashboard UI (approval/rejection)
- [x] Mobile responsive design
- [x] Multi-language support (i18n) - English, Italian, French, German, Spanish, Swedish, Portuguese, Dutch
- [x] Language switcher in navigation
- [x] Persistent language preference in user profile
- [x] "Learn More" button functionality - scroll to How It Works section

## Testing & Deployment
- [x] Unit tests for matching algorithm
- [ ] Integration tests for verification flow
- [ ] E2E tests for critical user journeys
- [x] Security review (GDPR compliance, encryption)
- [ ] Performance optimization
- [ ] Final checkpoint and deployment readiness

## Phase 2 Preparation (Architecture Only)
- [ ] Design scalability hooks for trust score complexity
- [ ] Plan registry API integration points
- [ ] Structure for AI group optimization
- [ ] Conflict prediction framework
- [ ] Fraud detection placeholder
- [ ] Budget pooling calculator structure
