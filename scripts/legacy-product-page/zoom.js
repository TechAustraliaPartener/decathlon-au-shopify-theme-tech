import $ from 'jquery';

const defaults = {
  url: false,
  callback: false,
  target: false,
  duration: 120,
  on: 'mouseover',
  touch: true,
  onZoomIn: false,
  onZoomOut: false,
  magnify: 1
};

$.zoom = (t, i, n, o) => {
  let a;
  let r;
  let s;
  let c;
  let l;
  let d;
  let u;
  const p = $(t);
  const f = p.css('position');
  const h = $(i);
  t.style.position = /(absolute|fixed)/.test(f) ? f : 'relative';
  t.style.overflow = 'hidden';
  n.style.width = '';
  n.style.height = '';
  $(n)
    .addClass('zoomImg')
    .css({
      position: 'absolute',
      top: 0,
      left: 0,
      opacity: 0,
      width: n.width * o,
      height: n.height * o,
      border: 'none',
      maxWidth: 'none',
      maxHeight: 'none'
    })
    .appendTo(t);
  return {
    init() {
      r = p.outerWidth();
      a = p.outerHeight();
      if (i === t) {
        c = r;
        s = a;
      } else {
        c = h.outerWidth();
        s = h.outerHeight();
      }
      l = (n.width - r) / c;
      d = (n.height - a) / s;
      u = h.offset();
    },
    move(e) {
      let t = e.pageX - u.left;
      let i = e.pageY - u.top;
      i = Math.max(Math.min(i, s), 0);
      t = Math.max(Math.min(t, c), 0);
      n.style.left = `${t * -l}px`;
      n.style.top = `${i * -d}px`;
    }
  };
};

$.fn.zoom = function(opts) {
  return this.each(function() {
    const n = $.extend({}, defaults, opts || {});
    const o = (n.target && $(n.target)[0]) || this;
    const a = this;
    const r = $(a);
    const s = document.createElement('img');
    const c = $(s);
    const l = 'mousemove.zoom';
    if (!n.url) {
      const p = a.querySelector('img');
      if (p) n.url = p.getAttribute('data-src') || p.currentSrc || p.src;
      if (!n.url) return;
    }
    r.one(
      'zoom.destroy',
      ((e, t) => {
        r.off('.zoom');
        o.style.position = e;
        o.style.overflow = t;
        s.addEventListener('load', null);
        c.remove();
      }).bind(this, o.style.position, o.style.overflow)
    );

    s.addEventListener('load', () => {
      function t(t) {
        p.init();
        p.move(t);
        c.stop().fadeTo(
          $.support.opacity ? n.duration : 0,
          1,
          Boolean($.isFunction(n.onZoomIn)) && n.onZoomIn.call(s)
        );
      }

      function i() {
        c.stop().fadeTo(
          n.duration,
          0,
          Boolean($.isFunction(n.onZoomOut)) && n.onZoomOut.call(s)
        );
      }
      const p = $.zoom(o, a, s, n.magnify);
      if (n.on === 'grab')
        r.on('mousedown.zoom', n => {
          if (n.which === 1) {
            $(document).one('mouseup.zoom', () => {
              i();
              $(document).off(l, p.move);
            });
            t(n);
            $(document).on(l, p.move);
            n.preventDefault();
          }
        });
      else if (n.on === 'click')
        r.on('click.zoom', () => {
          // Return d ? void 0 : (d = true, t(n), e(document).on(l, p.move), e(document).one("click.zoom", function() {
          //     i(), d = false, e(document).off(l, p.move)
          // }), false)
        });
      else if (n.on === 'toggle')
        r.on('click.zoom', () => {
          // D ? i() : t(e), d = !d
        });
      else if (n.on === 'mouseover') {
        p.init();
        r.on('mouseenter.zoom', t)
          .on('mouseleave.zoom', i)
          .on(l, p.move);
      }
      if (n.touch)
        r.on('touchstart.zoom', () => {
          // E.preventDefault(), u ? (u = false, i()) : (u = true, t(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]))
        })
          .on('touchmove.zoom', () => {
            // E.preventDefault(), p.move(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0])
          })
          .on('touchend.zoom', () => {
            // E.preventDefault(), u && (u = false, i())
          });
      if ($.isFunction(n.callback)) n.callback.call(s);
    });
    s.src = n.url;
  });
};

$.fn.zoom.defaults = defaults;
