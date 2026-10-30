// Anniversary of Love
// - นับเวลาที่รักกันมาแล้ว (วัน ชั่วโมง นาที วินาที + ยอดรวม)
// - นับถอยหลังสู่วันครบรอบปีถัดไป
// แก้วันเริ่มคบได้ที่ data-start ของ <div id="anniversary"> ใน docs/index.html
// ทุกอย่างคำนวณใหม่อัตโนมัติทุกปี

(function () {
    'use strict';

    var root = document.getElementById('anniversary');
    if (!root) {
        return;
    }

    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})([+-])(\d{2}):(\d{2})$/.exec(root.dataset.start || '');
    if (!match) {
        return;
    }

    var startYear = +match[1];
    var month = +match[2];
    var day = +match[3];
    var hour = +match[4];
    var minute = +match[5];
    var second = +match[6];
    var offsetMinutes = (match[7] === '-' ? -1 : 1) * (+match[8] * 60 + +match[9]);

    var SECOND = 1000;
    var MINUTE = 60 * SECOND;
    var HOUR = 60 * MINUTE;
    var DAY = 24 * HOUR;

    var thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    // เวลา (ms) ของวันครบรอบปีที่ n ในเขตเวลาเดียวกับวันเริ่มคบ
    var anniversaryOf = function (n) {
        var year = startYear + n;
        var daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate(); // กัน 29 ก.พ.
        return Date.UTC(year, month - 1, Math.min(day, daysInMonth), hour, minute, second) - offsetMinutes * MINUTE;
    };

    var startMs = anniversaryOf(0);

    var all = function (selector) {
        return root.querySelectorAll(selector);
    };

    var setText = function (selector, value) {
        var nodes = all(selector);
        var text = String(value);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].textContent !== text) {
                nodes[i].textContent = text;
            }
        }
    };

    // เปลี่ยนตัวเลขพร้อมแอนิเมชันเล็กๆ
    var setTick = function (selector, value) {
        var nodes = all(selector);
        var text = String(value);
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            if (el.textContent !== text) {
                el.textContent = text;
                el.classList.remove('tick');
                void el.offsetWidth; // เริ่มแอนิเมชันใหม่
                el.classList.add('tick');
            }
        }
    };

    var pad = function (n) {
        return ('0' + n).slice(-2);
    };

    var fmt = function (n) {
        return n.toLocaleString('en-US');
    };

    var thaiDate = function (ms, withTime) {
        var d = new Date(ms + offsetMinutes * MINUTE); // อ่านแบบ UTC = เวลาท้องถิ่นของวันเริ่มคบ
        var text = d.getUTCDate() + ' ' + thaiMonths[d.getUTCMonth()] + ' ' + (d.getUTCFullYear() + 543);
        if (withTime) {
            text += ' · ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ' น.';
        }
        return text;
    };

    var showClock = function (prefix, ms) {
        var s = Math.max(0, Math.floor(ms / SECOND));
        setTick('.js-' + prefix + '-days', fmt(Math.floor(s / 86400)));
        setTick('.js-' + prefix + '-hours', pad(Math.floor(s / 3600) % 24));
        setTick('.js-' + prefix + '-minutes', pad(Math.floor(s / 60) % 60));
        setTick('.js-' + prefix + '-seconds', pad(s % 60));
    };

    var celebrate = root.querySelector('.celebrate');
    var progress = root.querySelector('.progress');
    var progressFill = root.querySelector('.progress-fill');

    var update = function () {
        var now = Date.now();

        var years = 0;
        while (anniversaryOf(years + 1) <= now) {
            years++;
        }

        var last = anniversaryOf(years);
        var next = anniversaryOf(years + 1);
        var elapsed = Math.max(0, now - startMs);

        // เรารักกันมาแล้ว
        showClock('up', elapsed);
        setText('.js-total-hours', fmt(Math.floor(elapsed / HOUR)));
        setText('.js-total-minutes', fmt(Math.floor(elapsed / MINUTE)));
        setText('.js-total-seconds', fmt(Math.floor(elapsed / SECOND)));

        // นับถอยหลัง
        showClock('down', next - now);

        setText('.js-years', years);
        setText('.js-years-label', years === 1 ? 'Year' : 'Years');
        setText('.js-next-year', years + 1);
        setText('.js-next-date', thaiDate(next, true));

        var percent = Math.min(100, Math.max(0, ((now - last) / (next - last)) * 100));
        setText('.js-progress', percent.toFixed(1));
        if (progressFill) {
            progressFill.style.width = percent.toFixed(2) + '%';
        }
        if (progress) {
            progress.setAttribute('aria-valuenow', percent.toFixed(0));
        }

        if (celebrate) {
            celebrate.hidden = !(years > 0 && now - last < DAY);
        }
    };

    // หัวใจลอยพื้นหลัง
    var makeHearts = function () {
        var layer = document.querySelector('.hearts-bg');
        if (!layer || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
            return;
        }
        var glyphs = ['♥', '❤', '♡'];
        var count = window.innerWidth < 600 ? 10 : 18;
        for (var i = 0; i < count; i++) {
            var h = document.createElement('span');
            h.textContent = glyphs[i % glyphs.length];
            h.style.left = (Math.random() * 100).toFixed(1) + '%';
            h.style.fontSize = (12 + Math.random() * 22).toFixed(0) + 'px';
            h.style.animationDuration = (12 + Math.random() * 14).toFixed(1) + 's';
            h.style.animationDelay = (-Math.random() * 26).toFixed(1) + 's';
            h.style.setProperty('--o', (0.12 + Math.random() * 0.22).toFixed(2));
            h.style.setProperty('--drift', ((Math.random() - 0.5) * 120).toFixed(0) + 'px');
            layer.appendChild(h);
        }
    };

    setText('.js-start-date', thaiDate(startMs, true));

    var thisYear = document.getElementById('this-year');
    if (thisYear) {
        thisYear.textContent = new Date().getFullYear();
    }

    makeHearts();
    update();
    setInterval(update, 1000);
})();
