document.addEventListener('DOMContentLoaded', function() {
    // ページが読み込まれたときに保存された状態を復元
    restoreCheckboxState();
    window.addEventListener('beforeunload', function() {
        saveCheckboxState();
    });
});

function saveCheckboxState() {
    // チェックボックスの状態を取得して保存
    const checkbox1 = document.getElementById('checkbox1');
    const favorite1 = document.getElementById('favorite1');

    localStorage.setItem('checkbox1', checkbox1.checked);
    localStorage.setItem('favorite1', favorite1.checked);
}

function restoreCheckboxState() {
    // 保存された状態を取得して復元
    const checkbox1 = document.getElementById('checkbox1');
    const favorite1 = document.getElementById('favorite1');

    const savedCheckbox1State = localStorage.getItem('checkbox1');
    const savedCheckbox2State = localStorage.getItem('favorite1');

    if (savedCheckbox1State !== null) {
        checkbox1.checked = JSON.parse(savedCheckbox1State);
    }

    if (savedCheckbox2State !== null) {
        favorite1.checked = JSON.parse(savedCheckbox2State);
    }
}
