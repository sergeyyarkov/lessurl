import './alpine.js';

document.addEventListener('alpine:init', () => {
  Alpine.data('app', () => ({
    isProcessingCutUrl: false,
    errorCutReqMessage: '',
    shortedUrl: '',
    async handleSubmitForm(e) {
      try {
        var nameURL = e.target.elements.n.value;
        var originalURL = e.target.elements.u.value;
        var expTimeMins = e.target.elements.e.value;
        var URLParams = { u: originalURL, n: nameURL, e: expTimeMins };

        e.preventDefault();
        this.isProcessingCutUrl = true;
        this.errorCutReqMessage = '';

        for (const k in URLParams) {
          if (!URLParams[k]) delete URLParams[k];
        }

        var res = await fetch(`/cut?${new URLSearchParams(Object.entries(URLParams)).toString()}`, {
          method: 'GET',
        });

        if (!res.ok) {
          if (res.headers.get('content-type').includes('application/json')) {
            var data = await res.json();
            this.errorCutReqMessage = data.message;
            return;
          }
          this.errorCutReqMessage = res.statusText;
          return;
        }

        this.shortedUrl = await res.text();
      } catch (error) {
        console.error(`Error cutting URL:`, error);
      } finally {
        this.isProcessingCutUrl = false;
        e.target.reset();
        setTimeout(() => (this.errorCutReqMessage = ''), 5000);
      }
    },
    copyUrl() {
      var $toast = this.$refs.copyUrlToast;
      navigator.clipboard.writeText(this.shortedUrl);
      if ($toast.hasAttribute('hidden')) {
        $toast.removeAttribute('hidden');
        setTimeout(() => $toast.setAttribute('hidden', true), 1000);
      }
    },
  }));
});
