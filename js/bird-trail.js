(function () {
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  if (reducedMotion.matches || !finePointer.matches) {
    return;
  }

  var lastX = null;
  var lastY = null;
  var lastPrintAt = 0;
  var step = 0;
  var minDistance = 34;
  var minDelay = 58;

  function makePrint(x, y, angle) {
    var print = document.createElement('span');
    var sideOffset = step % 2 === 0 ? -6 : 6;
    var radians = angle * Math.PI / 180;
    var offsetX = Math.cos(radians + Math.PI / 2) * sideOffset;
    var offsetY = Math.sin(radians + Math.PI / 2) * sideOffset;

    print.className = 'bird-print-trail';
    print.setAttribute('aria-hidden', 'true');
    print.style.left = (x + offsetX) + 'px';
    print.style.top = (y + offsetY) + 'px';
    print.style.transform = 'translate(-50%, -50%) rotate(' + (angle + 90) + 'deg) scale(' + (step % 2 === 0 ? 0.96 : 1.06) + ')';

    document.body.appendChild(print);
    step += 1;

    window.setTimeout(function () {
      print.classList.add('is-fading');
    }, 40);

    window.setTimeout(function () {
      if (print.parentNode) {
        print.parentNode.removeChild(print);
      }
    }, 1450);
  }

  window.addEventListener('pointermove', function (event) {
    if (event.pointerType && event.pointerType !== 'mouse') {
      return;
    }

    var now = Date.now();

    if (lastX === null || lastY === null) {
      lastX = event.clientX;
      lastY = event.clientY;
      return;
    }

    var dx = event.clientX - lastX;
    var dy = event.clientY - lastY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < minDistance || now - lastPrintAt < minDelay) {
      return;
    }

    makePrint(event.clientX, event.clientY, Math.atan2(dy, dx) * 180 / Math.PI);

    lastX = event.clientX;
    lastY = event.clientY;
    lastPrintAt = now;
  }, { passive: true });
}());
