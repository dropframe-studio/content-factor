// pipeline/index.ts

import { runCapturePipeline } from './capture/commit.js';
import { runTransformPipeline } from './transform.js';
import { runPublishPipeline } from './publish.js';
import { runMeasurementPipeline } from './measure.js';

/**
 * Executes the full Content Factor pipeline:
 * Capture -> Transform -> Publish -> Measure.
 */
async function runFullPipeline() {
    try {
        console.log("======================================================");
        console.log("⚙️ Starting Content Factor Pipeline (Capture → Measure)");
        console.log("======================================================");

        // 1. Capture: Get raw work (e.g., latest commit) and create an Artifact JSON.
        await runCapturePipeline();

        // 2. Transform: Run the Artifact through templates to create structured content JSON.
        await runTransformPipeline();

        // 3. Publish: Convert structured content JSON into final outputs (e.g., Markdown).
        await runPublishPipeline();

        // 4. Measure: Check/log outputs and prepare for metrics collection.
        await runMeasurementPipeline();

        console.log("======================================================");
        console.log("✅ Pipeline Complete: Artifact has been processed.");
        console.log("======================================================\n");

    } catch (error) {
        console.error("\n❌ FATAL PIPELINE ERROR:", error);
        process.exit(1);
    }
}

// Check if the script is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runFullPipeline();
}
