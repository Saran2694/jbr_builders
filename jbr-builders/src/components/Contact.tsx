/**
 * Legacy Contact component proxy.
 * Re-exports the official ContactPage component located at src/pages/ContactPage.tsx.
 * Only 2 forms exist in the entire application: /contact and /careers.
 */
export { ContactPage as Contact } from '../pages/ContactPage';
export { ContactPage } from '../pages/ContactPage';
export default ContactPage;
import { ContactPage } from '../pages/ContactPage';
