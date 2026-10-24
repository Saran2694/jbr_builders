import React from 'react';

/**
 * DEPRECATED: Per site requirements, exactly 2 forms exist across the entire website:
 * 1. Contact & Consultation Form at /contact (ContactPage.tsx)
 * 2. Career & Internship Application Form at /careers (CareerPage.tsx)
 *
 * All quote and consultation triggers site-wide navigate directly to /contact.
 */
export interface QuoteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  preselectedService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = () => {
  return null;
};

export default QuoteModal;
