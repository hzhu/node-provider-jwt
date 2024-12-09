# Node Provider Protection with JWTs in Frontend dApps

[![Medium](https://img.shields.io/badge/Medium-12100E?style=for-the-badge&logo=medium&logoColor=white&style=flat-square)](https://medium.com/@henballs/protecting-node-provider-urls-for-frontend-dapps-c9a8159fc94d)
[![Medium](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white&style=flat-square)](https://node-provider-jwt-alpha.vercel.app)

<a href="https://medium.com/@henballs/protecting-node-provider-urls-for-frontend-dapps-c9a8159fc94d">  
  <img src="https://github.com/user-attachments/assets/884d17b2-def8-4fd7-ba80-2d839dbda256" alt="Locks" style="width:75%;" />  
  <br />
  <br />
</a>

This project demonstrates how to protect node provider API keys (e.g., for services like Alchemy) in frontend dApps using JWTs. By leveraging short-lived JWTs, we can securely manage access to node providers without exposing API keys directly in the frontend. For a detailed explanation, check out the [blog post](https://medium.com/@henballs/protecting-node-provider-urls-for-frontend-dapps-c9a8159fc94d) here, and see the solution in action in the [demo app](https://node-provider-jwt-alpha.vercel.app).

## Getting Started

Follow these steps to set up the project locally:

### Environment Variables

Create a `.env` file in the root of the project and add the following environment variables. You can find the explanations for these variables in the [blog post](https://medium.com/@henballs/protecting-node-provider-urls-for-frontend-dapps-c9a8159fc94d).

```bash
ALCHEMY_PRIVATE_KEY_PKCS8=<Your PKCS8 Private Key>
ALCHEMY_KEY_ID=<Your Key ID>
NEXT_PUBLIC_WC_PROJECT_ID=<Your WalletConnect Project ID>
```

### Development Server

To run the application locally, run:

```bash
npm install
npm run dev
```
