import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

const handler = NextAuth({
  // debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("bob", credentials);
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  },
  // Configure one or more authentication providers
  providers: [
    CognitoProvider({
      redirect_uri: "http://localhost:3000/api/auth/callback/cognito",
      clientId: "42d3cdrgh9nmoce0q5qo2879i2",
      clientSecret: "12v0jsm4f6ev9mvg7bt1cgetg5pkh2cv83el5br7581r5r52t85b",
      issuer: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_7grKfaW7b"
    })
  ]
});

export { handler as GET, handler as POST };
