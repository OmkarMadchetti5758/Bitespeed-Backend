# Bitespeed Identity Reconciliation Backend

This is the backend service for the Bitespeed Identity Reconciliation system, designed to link disparate contact information into a single identity.

**GitHub Repository:** [https://github.com/OmkarMadchetti5758/Bitespeed-Backend](https://github.com/OmkarMadchetti5758/Bitespeed-Backend)

## Hosted API Endpoints

- **Health Check:** [https://bitespeed-backend-es12.onrender.com](https://bitespeed-backend-es12.onrender.com)
- **Identify Contact:** [https://bitespeed-backend-es12.onrender.com/api/identify](https://bitespeed-backend-es12.onrender.com/api/identify)

### Usage (Identify)
**POST** `/api/identify`

**Request Body:**
```json
{
  "email": "mcfly@hillvalley.edu",
  "phoneNumber": "123456"
}
```
