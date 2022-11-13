import { en } from 'vuetify/lib/locale'

export default {
  ...en,

  auth: {
    'sign-in': {
      'create-account': 'Create account',
      'forgot-email': 'Forgot email?',
      label: 'Email',
      'learn-more': 'Learn more',
      login: 'Login',
      private: 'Not your computer? Use a Private Window to sign in.',
      subtitle: 'Use your xinkgo account',
      title: 'Sign in',
      'enter-password': 'Enter your password',
      'forgot-password': 'Forgot password'
    },
    'sign-up': {
      create: 'Create your account',
      email: 'Your email address',
      'email-hint': "You'll need to confirm that this email belongs to you.",
      'display-name': 'Full name',
      instead: 'Sign in instead',
      done: 'Done',
      password: 'Password',
      'password-props': 'Use 8 or more characters with a mix of letters, numbers & symbols',
      title: 'Vuetify'
    },
    'checkemail':
    {
      message: 'Please check your email {0} to confirm your account. If you do not see anything in your inbox be sure to check your junk/spam mail',
      signin: 'Sign in'
    },
    'recoverpassword':
    {
      message: 'Please enter your email address and we’ll send you instructions on how to reset your password',
      signin: 'Sign in'
    },
    'sendpasswordresetemail':
    {
      message: 'Password reset email sent successfully. If you do not see anything in your inbox be sure to check your junk/spam mail',
      signin: 'Sign in'
    }
  },
  login: {
    footer: {
      help: 'Help',
      language: 'English (United States)',
      privacy: 'Privacy',
      terms: 'Terms'
    }
  }
}
