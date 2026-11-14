/* Optional progressive enhancement: navigation and video controls are native.
   This script adds a local enquiry preview and gentle one-time scroll reveals. */
const enquiryForm = document.querySelector('#enquiry-form');
const topic = document.querySelector('#topic');
const preview = document.querySelector('#enquiry-preview');
const status = document.querySelector('#form-status');

// Prevent Enter or an unexpected submit action from navigating or sending data.
enquiryForm.addEventListener('submit', (event) => event.preventDefault());

// Activity links still navigate normally; this adds a relevant selected topic.
document.querySelectorAll('[data-topic]').forEach((link) => {
  link.addEventListener('click', () => {
    topic.value = link.dataset.topic;
    preview.hidden = true;
    status.textContent = 'Topic selected: ' + topic.selectedOptions[0].textContent + '.';
  });
});

document.querySelector('#sample-details').addEventListener('click', () => {
  enquiryForm.elements.name.setCustomValidity('');
  enquiryForm.elements.message.setCustomValidity('');
  enquiryForm.elements.name.value = 'NAME';
  enquiryForm.elements.email.value = 'xxxxxxxx@example.xxx';
  if (!topic.value) topic.value = 'joining';
  enquiryForm.elements.message.value = 'Hi! This is an assignment for ICT2215';
  preview.hidden = true;
  status.textContent = 'Hi! This is an assignment for ICT2215';
});

// Native HTML constraints check required fields, email format and message length.
document.querySelector('#preview-enquiry').addEventListener('click', () => {
  const nameField = enquiryForm.elements.name;
  const messageField = enquiryForm.elements.message;
  nameField.setCustomValidity(nameField.value.trim() ? '' : 'Please enter a sample name.');
  messageField.setCustomValidity(messageField.value.trim().length >= 10 ? '' : 'Please write at least 10 characters, excluding spaces at the beginning and end.');
  if (!enquiryForm.reportValidity()) return;
  const fields = new FormData(enquiryForm);
  ['name', 'email', 'message'].forEach((field) => {
    document.querySelector('#preview-' + field).textContent = fields.get(field).trim();
  });
  document.querySelector('#preview-topic').textContent = topic.selectedOptions[0].textContent;
  preview.hidden = false;
  status.textContent = 'Enquiry preview ready. Nothing has been sent or saved.';
  preview.focus();
});

// Hide an old preview as soon as the visitor changes any details.
enquiryForm.addEventListener('input', (event) => {
  event.target.setCustomValidity('');
  if (!preview.hidden) {
    preview.hidden = true;
    status.textContent = 'Details changed. Preview again to review your updated enquiry.';
  }
});

// One-time scroll reveals: content is visible by default without JavaScript.
// IntersectionObserver reveals each block once and then stops watching it.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

  const revealTargets = document.querySelectorAll(
    '.about-copy, .about-media, .activities .eyebrow, .section-intro, ' +
    '.activity-card, .programme-note, .contact-copy, .form-panel, ' +
    '.footer-top, .footer-bottom'
  );

  revealTargets.forEach((element) => {
    revealObserver.observe(element);
    element.classList.add('reveal-pending');
  });

  // Keyboard users see a block immediately when tabbing into its controls.
  document.addEventListener('focusin', (event) => {
    const block = event.target.closest('.reveal-pending');
    if (block) {
      block.classList.add('is-revealed');
      revealObserver.unobserve(block);
    }
  });

  // Reveal everything if the visitor enables reduced motion while browsing.
  motionPreference.addEventListener('change', (event) => {
    if (event.matches) {
      revealTargets.forEach((element) => element.classList.add('is-revealed'));
      revealObserver.disconnect();
    }
  });
}
