'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

export default function QRCodeGenerator({ sessionId }) {
  const [qrCode, setQrCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = `${window.location.origin}/api/attendance`;
        const data = JSON.stringify({ sessionId });
        const qr = await QRCode.toDataURL(`${url}?data=${encodeURIComponent(data)}`);
        setQrCode(qr);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      } finally {
        setLoading(false);
      }
    };

    generateQR();
  }, [sessionId]);

  if (loading) {
    return <div>Generating QR code...</div>;
  }

  return (
    <div className="qr-code-container">
      <img src={qrCode} alt="Attendance QR Code" className="qr-code" />
      <p className="qr-instructions">Scan this QR code to mark your attendance</p>
    </div>
  );
}