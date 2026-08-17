// Inspeksi model ONNX: menampilkan input/output shape dan mencoba inferensi.
// Dipakai untuk verifikasi lokal; tidak dipakai di runtime website.
// Jalankan: node scripts/inspect_model.cjs
const fs = require("fs");
const path = require("path");
const ort = require("onnxruntime-node");

async function main() {
  const modelPath = path.resolve("public/models/mobilenetv2.onnx");
  const bytes = fs.readFileSync(modelPath);
  const session = await ort.InferenceSession.create(bytes, {
    executionProviders: ["cpu"],
  });
  console.log("INPUTS:", session.inputNames);
  console.log("OUTPUTS:", session.outputNames);

  // Inferensi percobaan dengan input NHWC [1,224,224,3] (format yang dipakai website)
  const t = new ort.Tensor("float32", new Float32Array(224 * 224 * 3), [1, 224, 224, 3]);
  const feeds = { [session.inputNames[0]]: t };
  const out = await session.run(feeds);
  const outName = session.outputNames[0];
  console.log(`OUT dims=[${out[outName].dims.join(",")}]`);
  console.log(`OUT sample:`, Array.from(out[outName].data.slice(0, 3)));
  console.log("Inference OK — format input website benar (NHWC 224x224x3).");
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
