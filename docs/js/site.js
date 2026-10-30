// นับถอยหลังวันครบรอบ
// แก้วันเริ่มคบได้ที่ data-start ของ <div id="anniversary"> ใน docs/index.html
// ทุกอย่างคำนวณใหม่อัตโนมัติทุกปี ไม่ต้องแก้วันที่ในโค้ดอีก

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
    var DAY_MS = 24 * 60 * 60 * 1000;

    var thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

    // เวลา (ms) ของวันครบรอบปีที่ n ในเขตเวลาเดียวกับวันเริ่มคบ
    var anniversaryOf = function (n) {
        var year = startYear + n;
        var daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate(); // กัน 29 ก.พ.
        return Date.UTC(year, month - 1, Math.min(day, daysInMonth), hour, minute, second) - offsetMinutes * 60000;
    };

    var startMs = anniversaryOf(0);
    var celebrate = root.querySelector('.celebrate');

    var setText = function (selector, value) {
        var nodes = root.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].textContent = value;
        }
    };

    var pad = function (n) {
        return ('0' + n).slice(-2);
    };

    var thaiDate = function (ms) {
        var d = new Date(ms + offsetMinutes * 60000); // อ่านค่าแบบ UTC = เวลาท้องถิ่นของวันเริ่มคบ
        return d.getUTCDate() + ' ' + thaiMonths[d.getUTCMonth()] + ' ' + (d.getUTCFullYear() + 543);
    };

    var updateWatchClock = function () {
        var now = Date.now();

        var years = 0;
        while (anniversaryOf(years + 1) <= now) {
            years++;
        }

        var last = anniversaryOf(years);
        var next = anniversaryOf(years + 1);
        var totalSeconds = Math.max(0, Math.floor((next - now) / 1000));

        setText('.days', Math.floor(totalSeconds / 86400));
        setText('.hours', pad(Math.floor(totalSeconds / 3600) % 24));
        setText('.minutes', pad(Math.floor(totalSeconds / 60) % 60));
        setText('.seconds', pad(totalSeconds % 60));

        setText('.js-years', years);
        setText('.js-years-label', years === 1 ? 'Year' : 'Years');
        setText('.js-next-year', years + 1);
        setText('.js-next-date', thaiDate(next));
        setText('.js-total-days', Math.max(0, Math.floor((now - startMs) / DAY_MS)).toLocaleString('en-US'));

        if (celebrate) {
            celebrate.hidden = !(years > 0 && now - last < DAY_MS);
        }
    };

    var thisYear = document.getElementById('this-year');
    if (thisYear) {
        thisYear.textContent = new Date().getFullYear();
    }

    updateWatchClock();
    setInterval(updateWatchClock, 1000);
})();
