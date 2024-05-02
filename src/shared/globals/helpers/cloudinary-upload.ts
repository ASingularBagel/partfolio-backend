import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export const cloudinaryUpload = async (
  file: string,
  public_Id?: string,
  overwrite?: boolean,
  invalidate?: boolean
): Promise<UploadApiResponse | UploadApiErrorResponse | undefined> => {
  try {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(
        file,
        {
          public_id: public_Id,
          overwrite: overwrite,
          invalidate: invalidate
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) resolve(error);
          resolve(result);
        }
      );
    });
  } catch (error) {
    return error as unknown as UploadApiErrorResponse;
  }
};
