import sharp from "sharp";

export const convertFormatted = (toFormat : string, inputPath :string ) => {
    let pipeline = sharp(inputPath);
    switch (toFormat) {
      case "jpg":
        pipeline = pipeline.jpeg();
        break;
      case "png":
        pipeline = pipeline.png();
        break;
      case "webp":
        pipeline = pipeline.webp();
        break;
    }

    return pipeline;
}