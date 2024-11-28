const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeToggleContainer = document.getElementById('darkModeToggleContainer');

// بررسی وضعیت قبلی حالت تاریک (در صورتی که قبلاً انتخاب شده باشد)
if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true; // فعال بودن حالت تاریک در کشوی وضعیت
}

darkModeToggle.addEventListener('change', () => {
    const isDarkMode = darkModeToggle.checked;

    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }
});
