(function () {
  var form = document.getElementById('projectInquiryForm');
  var status = document.getElementById('projectInquiryStatus');
  var responseFrame = document.querySelector('iframe[name="googleFormHiddenFrame"]');
  var submitButton = form ? form.querySelector('button[type="submit"]') : null;
  var submissionPending = false;
  var submitButtonText = submitButton ? submitButton.textContent : 'Send inquiry';

  var fields = {
    firstName: 'entry.1584213641',
    lastName: 'entry.140386484',
    email: 'entry.835425953',
    businessName: 'entry.2018019423',
    websiteStage: 'entry.1243877280',
    existingWebsite: 'entry.824268876',
    timeline: 'entry.671129583',
    budget: 'entry.1471166220',
    services: 'entry.2117219581',
    projectDetails: 'entry.1496300641'
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
    submissionPending = false;
    form.removeAttribute('aria-busy');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = submitButtonText;
    }
  }

  if (responseFrame) {
    responseFrame.addEventListener('load', function () {
      if (!submissionPending) {
        return;
      }

      setStatus('Thank you — your inquiry has been sent. I’ll be in touch soon.', 'is-success');
      form.reset();
      finishSubmission();
    });
  }

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
      window.location.href = 'mailto:sheila@webdesignbysheila-t.website?subject=' + subject + '&body=' + body;
      setStatus('Your email app should open with the inquiry details. Once the Google connection is ready, this form can submit directly.', 'is-success');
      return;
    }

    form.setAttribute('action', action);
    submissionPending = true;
    form.setAttribute('aria-busy', 'true');
    setStatus('Sending your inquiry…');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
    }
  });
}());
