# Proof of Participation: iExchange Testing and ZK Workshop
## Overview
This project provides a privacy-preserving solution for verifying attendance at the iExchange Testing and ZK Workshop event without revealing any sensitive personal information. The verification system utilizes Zero-Knowledge Proofs (zkProofs) to confirm that a user registered for and attended the event without disclosing detailed ticket or personal data.

By integrating zkPass with event platforms like Lu.ma, participants can prove their event attendance securely and anonymously. This is ideal for use cases such as validating attendance for rewards, certifications, or event-related perks (e.g., bounties, merch).

## Key Features
**Privacy-Preserving Verification**: Users can prove their participation in events without revealing full ticket or registration details.  
**Integration with Lu.ma**: Retrieves event registration and attendance data via the Lu.ma API to enable zkProof-based verification.  
**Zero-Knowledge Proofs**: Attendees can generate zkProofs that confirm their participation without revealing their identity or any sensitive data.  

## Use Case
**Event**: iExchange Testing and ZK Workshop  
**Date**: Saturday, October 12, 2024  
**Location**: AyaHQ Builder Hub, Accra, Greater Accra Region  
**Event Type**: Interactive workshop on Zero-Knowledge Proofs, powered by ZK Pass. Opportunity to test the iExchange P2P platform and win bounties.

## How It Works
How It Works
1. User Request
The participant initiates a verification request, such as proving they attended the iExchange Testing and ZK Workshop, without revealing their registration or personal details.

2. zkPass Verification
zkPass generates a zero-knowledge proof based on the event attendance data retrieved via the Lu.ma API. This proof confirms that the participant registered for and attended the event, while keeping sensitive information (like personal details and ticket information) hidden.

3. Proof Submission
The participant submits the zkProof to the verifier (event organizers, bounty distributors, or reward providers), allowing them to confirm event participation without accessing any private information.

4. Verification Result
The verifier receives and evaluates the zkProof, confirming the participant's attendance at the event.

# License
This project is licensed under the MIT License`