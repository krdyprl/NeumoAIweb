"""
Re-export model MobileNetV2 untuk Grad-CAM di website dokter.

Masalah:
- Model lama (public/models/mobilenetv2.onnx) hanya meng-output probabilitas
  (dense_6, [1,1]) dan tidak menyediakan feature map -> tidak bisa Grad-CAM.
- Grad-CAM butuh FEATURE MAP lapisan konvolusi terakhir (out_relu, [1,7,7,1280])
  PLUS bobot dense yang sudah di-training.

Skrip ini memuat model Keras hasil training (SavedModel) lalu mengekspornya
ke ONNX dengan 2 output:
  1. prob          : [1,1]  -> probabilitas pneumonia (sigmoid)
  2. feature_map   : [1,7,7,1280] -> feature map utk Grad-CAM

Cara pakai:
  python scripts/export_gradcam_model.py \
      --savedmodel /path/ke/model_savedmodel \
      --out public/models/mobilenetv2_gradcam.onnx

Jika --savedmodel dihilangkan, skrip membangun model dengan bobot ImageNet
(hanya untuk uji pipeline, BUKAN model pneumonia final).

Dependensi:
  pip install tensorflow tf2onnx onnx
"""
import argparse
import os

import tensorflow as tf
import tf2onnx


def build_gradcam_model(weights="imagenet"):
    """Model identik dgn training, tapi feature map dipertahankan sebagai output."""
    base = tf.keras.applications.MobileNetV2(
        input_shape=(224, 224, 3), include_top=False, weights=weights, pooling=None
    )
    inp = tf.keras.Input((224, 224, 3))
    x = tf.keras.applications.mobilenet_v2.preprocess_input(inp)
    x = base(x, training=False)  # feature map [1,7,7,1280] (tanpa global pooling)
    feature_map = x
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.3)(x)
    out = tf.keras.layers.Dense(1, activation="sigmoid", name="dense")(x)
    return tf.keras.Model(inp, [out, feature_map], name="neumoaid_gradcam")


def main():
    parser = argparse.ArgumentParser(description="Export MobileNetV2 Grad-CAM ONNX")
    parser.add_argument("--savedmodel", help="Path ke SavedModel hasil training (opsional)")
    parser.add_argument("--out", default=os.path.join(
        os.path.dirname(__file__), "..", "public", "models", "mobilenetv2_gradcam.onnx"))
    args = parser.parse_args()

    out_path = os.path.abspath(args.out)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    if args.savedmodel and os.path.isdir(args.savedmodel):
        print(f"[*] Memuat bobot training dari: {args.savedmodel}")
        trained = tf.keras.models.load_model(args.savedmodel)
        model = build_gradcam_model(weights=None)
        # Salin bobot dari model training ke model grad-cam (layer base + dense sama).
        _copy_weights(trained, model)
    else:
        print("[!] --savedmodel tidak diberikan -> pakai bobot ImageNet (uji pipeline saja).")
        model = build_gradcam_model(weights="imagenet")

    spec = (tf.TensorSpec((None, 224, 224, 3), tf.float32, name="input"),)
    tf2onnx.convert.from_keras(model, input_signature=spec, opset=13, output_path=out_path)
    print(f"[OK] Model Grad-CAM tersimpan: {out_path}")


def _copy_weights(src, dst):
    """Salin bobot layer dari model training (src) ke model grad-cam (dst)."""
    src_layers = {l.name: l for l in src.layers}
    for layer in dst.layers:
        if layer.name in src_layers and len(layer.get_weights()) > 0:
            layer.set_weights(src_layers[layer.name].get_weights())
            print(f"    salin bobot layer: {layer.name}")


if __name__ == "__main__":
    main()
