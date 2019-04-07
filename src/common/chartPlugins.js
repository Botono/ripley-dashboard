export const drawRectPlugin = {
    getLinePosition: function (chart, pointIndex) {
        const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
        const data = meta.data;
        return data[pointIndex]._model.x;
    },
    renderRectangle: function (chart) {
        const ctx = chart.chart.ctx;
        const yHighlightRange = chart.config.data.yHighlightRange;

        let yRangeBegin = yHighlightRange.lower;
        let yRangeEnd = yHighlightRange.upper;

        let xaxis = chart.scales['x-axis-0'];
        let yaxis = chart.scales['y-axis-0'];

        let yRangeBeginPixel = yaxis.getPixelForValue(yRangeBegin);
        let yRangeEndPixel = yaxis.getPixelForValue(yRangeEnd);

        ctx.save();

        // The fill style of the rectangle we are about to fill.
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        // Fill the rectangle that represents the highlight region. The parameters are the closest-to-starting-point pixel's x-coordinate,
        // the closest-to-starting-point pixel's y-coordinate, the width of the rectangle in pixels, and the height of the rectangle in pixels, respectively.
        ctx.fillRect(xaxis.left, Math.min(yRangeBeginPixel, yRangeEndPixel), xaxis.right - xaxis.left, Math.max(yRangeBeginPixel, yRangeEndPixel) - Math.min(yRangeBeginPixel, yRangeEndPixel));

        ctx.restore();
    },
    beforeDatasetsDraw: function (chart, easing) {
        if (chart.config.data.yHighlightRange) {
            this.renderRectangle(chart)
        }
    }
};