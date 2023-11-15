import GmailSignIn from './GmailSignIn.mjs'

(async () => {
  try {
      const signIn = new GmailSignIn();
      await signIn.init();
      await signIn.enterFirstName();
      await signIn.enterBirthAndGender();
      await signIn.enterUsername();
      await signIn.enterPassword();
      await signIn.verifyResults();
      await signIn.terminate();
  
    } catch (error) {
      console.error('An error occurred:', error);
  }
})();