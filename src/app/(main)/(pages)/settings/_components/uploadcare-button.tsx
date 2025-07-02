// 'use client'
// import React, { useEffect, useRef } from 'react'
// import * as LR from '@uploadcare/blocks'
// import { useRouter } from 'next/navigation'

// type Props = {
//     onUpload? : (e: string)=> any
// }

// LR.registerBlocks(LR)

// const UploadCareButton = ({onUpload}: Props) => {
//     const router = useRouter()
//     const ctxProviderRef = useRef<
//         typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
//     >(null)

//     useEffect(() => {
//         const handleUpload = async (e:any) => {
//             if (onUpload) {
//                 const file = await onUpload(e.detail.cdnUrl);
//                 if (file) router.refresh();
//             }
//         }

//         if (ctxProviderRef.current) {
//             ctxProviderRef.current.addEventListener('file-upload-success', handleUpload);
//         }
//     }, [onUpload, router])
    
//     return (
//         <div>
//             <lr-config
//                 ctx-name="my-uploader"
//                 pubkey="a9428ff5ff90ae7a64eb"
//             />

//             <lr-file-uploader-regular
//                 ctx-name="my-uploader"
//                 css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css`}
//             />

//             <lr-upload-ctx-provider
//                 ctx-name="my-uploader"
//                 ref={ctxProviderRef}
//             />
//         </div>
//     )
// }

// export default UploadCareButton

"use client";

import { useState } from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";

type FileEntry = {
  uuid: string;
  cdnUrl: string;
};

interface Props {
  onUpload?: (cdnUrl: string) => any;
}

export default function UploadCareButton({ onUpload }: Props) {
  const [files, setFiles] = useState<FileEntry[]>([]);

  const handleSuccess = (file: any) => {
    const entry = {
      uuid: file.uuid,
      cdnUrl: file.cdnUrl,
    };
    setFiles((prev) => [...prev, entry]);
    onUpload?.(file.cdnUrl);
  };

  return (
    <div>
      <FileUploaderRegular
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
        onFileUploadSuccess={handleSuccess}
      />
      <div>
        {files.map((f) => (
          <img
            key={f.uuid}
            src={f.cdnUrl}
            alt="upload preview"
            style={{ width: 100 }}
          />
        ))}
      </div>
    </div>
  );
}
