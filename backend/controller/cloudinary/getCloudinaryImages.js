import { v2 as cloundinary } from "cloudinary";

export const getCloudinaryImages = async (req, res) => {
  const { resources } = await cloundinary.search
    .expression("folder:dev_setups")
    .sort_by("public_id", "desc")
    .max_results(1)
    .execute();
  const publicIds = resources.map((file) => file.secure_url);
  res.send(publicIds);
};
