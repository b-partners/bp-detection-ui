const CAPTCHA_HOSTNAMES = ['roof.birdia.fr', 'roof.preprod.birdia.fr'];

/** reCAPTCHA is only checked on the deployed Birdia domains; anywhere else (localhost, previews…) it is skipped. */
export const isCaptchaEnabled = (hostname = window.location.hostname) => CAPTCHA_HOSTNAMES.includes(hostname);
