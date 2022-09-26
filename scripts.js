
let data = {
    labelWidth: 5.5,
    formatedValueWidth: 8,
    subbarHeight: 2.25,
    subbarFormatedValueWidth: 7,
    subbarTooltipPercent: 20,
    barColor: '#afc5fd',
    subbarColors: ['#a66464', '#439971'],
    data: [
        {
            label: 'General',
            total: 30000.0,
            formatedValues: ['Income (100%)', '$ 30,000.00'],
            subbars: [
                { formatedValues: ['Expenses (70%)', '$ 21,000.00'], value: 21000.0},
                { formatedValues: ['Profit (30%)', '$ 9,000.00'], value: 9000.0}
            ]
        },
        {
            label: 'Product A',
            total: 15000.0,
            formatedValues: ['50% of general', '$ 15,000.00'],
            subbars: [
                { formatedValues: ['Expenses (60%)', '$ 9,000.00'], value: 9000.0 },
                { formatedValues: ['Profit (40%)', '$ 6,000.00'], value: 6000.0 }
            ]
        },
        {
            label: 'Product B',
            total: 9000.0,
            formatedValues: ['30% of general', '$ 9,000.00'],
            subbars: [
                { formatedValues: ['Expenses (78%)', '$ 7,000.00'], value: 7000.0 },
                { formatedValues: ['Profit (22%)', '$ 2,000.00'], value: 2000.0 }
            ]
        },
        {
            label: 'Product C',
            total: 6000.0,
            formatedValues: ['20% of general', '$ 6,000.00'],
            subbars: [
                { formatedValues: ['Expenses (83%)', '$ 5,000.00'], value: 5000.0},
                { formatedValues: ['Profit (17%)', '$ 1,000.00'], value: 1000.0}
            ]
        }
    ]
};

function createMultbarChart(params) {
    if (!params || !params.data) {
        return '';
    }

    if (!params.labelWidth) params.labelWidth = 6;
    if (!params.formatedValueWidth) params.formatedValueWidth = 6;
    if (!params.subbarHeight) params.subbarHeight = 6;
    if (!params.subbarFormatedValueWidth) params.subbarFormatedValueWidth = 6;
    if (!params.subbarTooltipPercent) params.subbarTooltipPercent = 20;

    function getBarWidth(percent, fix) {
        return `calc((100% - ${fix}rem) * ${percent} / 100)`;
    };

    function getSubbarWidth(value, total, fix) {
        if (total <= 0) {
            return '0';
        }
        let percent = value / total * 100;
        return getBarWidth(percent, fix);
    };

    let biggestBar = 0;
    for (let bar of params.data) {
        biggestBar = bar.total > biggestBar ? bar.total : biggestBar;
    }

    function createSubbar(bar, subbar) {
        subbarNumber++;
        let innerBarDif = (100 - subbar.value / bar.total * 100) * bar.percent / 100;
        let tooltip = innerBarDif < params.subbarTooltipPercent;
        let tooltipStyle = "";
        let tooltipLabelStyle = "";
        if (!tooltip) {
            tooltipStyle = "opacity: 1; background-color: transparent;"
            tooltipLabelStyle = "color: black";
        }
        let subbarWidth = getSubbarWidth(subbar.value, bar.total, 0);
        let subbarColor = params.subbarColors[subbarNumber - 1];
        return `
            <div class="multbar-subbar" style="height: ${params.subbarHeight}rem;">
                <div class="multbar-subbar-bar multbar-subbar-bar-${subbarNumber}" style="width: ${subbarWidth}; background-color: ${subbarColor}">
                    <div class="multbar-subbar-labels" style="width: ${params.subbarFormatedValueWidth}rem">
                        <div style="${tooltipStyle}">
                            ${subbar.formatedValues.map(v => `<div><label style="${tooltipLabelStyle}">${v}</label></div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    let barsHtml = '';
    let barNumber = 1;
    let subbarNumber = 0;
    for (let bar of params.data) {
        bar.percent = biggestBar <= 0 ? 0 : bar.total / biggestBar * 100;
        subbarNumber = 0;
        let barWidth = getBarWidth(bar.percent, params.labelWidth + params.formatedValueWidth);
        barsHtml += `
            <div class="multbar">
                <div class="multbar-label" style="width: ${params.labelWidth}rem"><span>${bar.label}</span></div>
                <div class="multbar-bar multbar-bar-${barNumber}" style="width: ${barWidth}; background-color: ${params.barColor}">
                    ${bar.subbars.map(subbar => createSubbar(bar, subbar)).join('')}
                </div>
                <div class="multbar-labels" style="width: ${params.formatedValueWidth}rem">
                    <div>${bar.formatedValues.map(v => `<div><label>${v}</label></div>`).join('')}</div>
                </div>
            </div>
        `;
        barNumber++;
    }
    return `<div class="multbar-container">${barsHtml}</div>`;
}
