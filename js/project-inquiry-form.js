(function () {
  var form = document.getElementById('projectInquiryForm');
  var status = document.getElementById('projectInquiryStatus');
  var responseFrame = document.querySelector('iframe[name="googleFormHiddenFrame"]');
  var submitButton = form ? form.querySelector('button[type="submit"]') : null;
  var submissionPending = false;
  var confirmationTimer = null;
  var submitButtonText = submitButton ? submitButton.textContent : 'Send inquiry';

  var fields = {
    firstName: 'entry.1294508782',
    lastName: 'entry.2059081400',
    email: 'entry.2108256210',
    businessName: 'entry.1254787358',
    websiteStage: 'entry.1662603164',
    existingWebsite: 'entry.2088389215',
    timeline: 'entry.98571016',
    budget: 'entry.755074804',
    services: 'entry.1198576406',
    projectDetails: 'entry.449540681'
  };

  if (!form || !status) {
    return;
  }

  function setStatus(message, type) {
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if (type) {
      status.classList.add(type);
    }
  }

  function buildEmailBody(formData) {
    var services = formData.getAll(fields.services).join(', ') || 'Not specified';
    return [
      'Website Project Inquiry',
      '',
      'Name: ' + [formData.get(fields.firstName), formData.get(fields.lastName)].filter(Boolean).join(' '),
      'Email: ' + (formData.get(fields.email) || ''),
      'Business / project: ' + (formData.get(fields.businessName) || 'Not specified'),
      'Website stage: ' + (formData.get(fields.websiteStage) || 'Not specified'),
      'Current website: ' + (formData.get(fields.existingWebsite) || 'Not specified'),
      'Services: ' + services,
      'Timeline: ' + (formData.get(fields.timeline) || 'Not specified'),
      'Budget: ' + (formData.get(fields.budget) || 'Not specified'),
      '',
      'Project details:',
      formData.get(fields.projectDetails) || ''
    ].join('\n');
  }

  function finishSubmission() {
    if (confirmationTimer) {
      clearTimeout(confirmationTimer);
      confirmationTimer = null;
    }
    submissionPending = false;
    form.removeAttribute('aria-busy');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = submitButtonText;
    }
  }

  // The hidden iframe loading is NOT proof the endpoint accepted an inquiry.
  // Only the explicit response message can confirm success.
  window.addEventListener('message', function (event) {
    if (!submissionPending || !event.data ||
        event.data.type !== 'bluejay-inquiry') return;
    if (event.origin !== 'https://script.google.com' &&
        event.origin !== 'https://script.googleusercontent.com' &&
        event.origin !== 'https://webdesignsbysheila.website') return;

    if (event.data.status === 'success') {
      setStatus('Thank you — your inquiry has been sent. I’ll be in touch soon.', 'is-success');
      form.reset();
    } else {
      setStatus('We could not confirm your inquiry. Please email sheila@webdesignsbysheila.website instead.', 'is-error');
    }
    finishSubmission();
  });


  form.addEventListener('submit', function (event) {
    var action = form.getAttribute('data-google-form-action') || form.getAttribute('action') || '';
    var formData = new FormData(form);

    if (formData.get('website')) {
      event.preventDefault();
      return;
    }

    if (!form.checkValidity()) {
      event.preventDefault();
      form.reportValidity();
      setStatus('Please fill in the required fields, then try again.', 'is-error');
      return;
    }

    if (!action || action.indexOf('PASTE_') !== -1) {
      event.preventDefault();
      var subject = encodeURIComponent('Website Project Inquiry');
      var body = encodeURIComponent(buildEmailBody(formData));
      window.location.href = 'mailto:sheila@webdesignsbysheila.website?subject=' + subject + '&body=' + body;
      setStatus('Your email app should open with the inquiry details. Once the Google connection is ready, this form can submit directly.', 'is-success');
      return;
    }

    form.setAttribute('action', action);
    submissionPending = true;
    confirmationTimer = setTimeout(function () {
      if (!submissionPending) return;
      setStatus('Could not confirm delivery. Please email sheila@webdesignsbysheila.website instead.', 'is-error');
      finishSubmission();
    }, 15000);
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your inquiry…');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }
  });
}());
