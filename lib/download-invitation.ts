export async function downloadInvitation() {
    const canvas = document.createElement("canvas"); canvas.width = 1400; canvas.height = 2000;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const center = canvas.width / 2;
    ctx.fillStyle = "#f8eddd"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#b88443"; ctx.lineWidth = 5; ctx.strokeRect(48, 48, 1304, 1904);
    ctx.strokeStyle = "#ad7435"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(78,78); ctx.lineTo(365,78); ctx.moveTo(1035,78); ctx.lineTo(1322,78); ctx.moveTo(78,270); ctx.lineTo(78,1570); ctx.moveTo(1322,270); ctx.lineTo(1322,1570); ctx.moveTo(375,1922); ctx.lineTo(1025,1922); ctx.stroke();
    const mandala = new Image();
    try {
      await new Promise<void>((resolve, reject) => {
        mandala.onload = () => resolve();
        mandala.onerror = () => reject(new Error("Invitation ornament could not load."));
        mandala.src = "/gold-mandala-transparent.png";
      });
      ctx.save(); ctx.globalAlpha = .62; ctx.drawImage(mandala, 50, -400, 1300, 867); ctx.restore();
      const drawCorner = (x: number) => { ctx.save(); ctx.globalAlpha = .62; ctx.translate(x + 480, 1460 + 320); ctx.rotate(Math.PI); ctx.drawImage(mandala, -480, -320, 960, 640); ctx.restore(); };
      drawCorner(-330); drawCorner(770);
    } catch { /* Download remains available if the ornament cannot load. */ }
    finally { mandala.onload = null; mandala.onerror = null; }
    ctx.textAlign = "center"; ctx.fillStyle = "#a16e35"; ctx.letterSpacing = "7px"; ctx.font = "700 33px Georgia"; ctx.fillText("TOGETHER WITH THEIR FAMILIES", center, 315);
    ctx.fillStyle = "#654536"; ctx.letterSpacing = "4px"; ctx.font = "40px Georgia"; ctx.fillText("MR & MRS MUNASINGHE", center, 390); ctx.fillStyle = "#b77b32"; ctx.font = "italic 32px Georgia"; ctx.fillText("and", center, 440); ctx.fillStyle = "#654536"; ctx.font = "40px Georgia"; ctx.fillText("MR & MRS ABEYWARNA", center, 490);
    ctx.font = "36px Georgia"; ctx.fillText("request the pleasure of your presence", center, 560);
    ctx.font = "34px Georgia"; ctx.fillText("as they celebrate the joyous occasion of the marriage", center, 630); ctx.fillText("of their beloved children", center, 675);
    ctx.letterSpacing = "4px"; ctx.fillStyle = "#553629"; ctx.font = "84px 'Times New Roman'"; ctx.fillText("CHATHURANGA", center, 805);
    ctx.fillStyle = "#b77b32"; ctx.letterSpacing = "3px"; ctx.font = "italic 38px Georgia"; ctx.fillText("&", center, 842);
    ctx.letterSpacing = "5px"; ctx.fillStyle = "#553629"; ctx.font = "94px 'Times New Roman'"; ctx.fillText("VINURI", center, 960);
    ctx.fillStyle = "#76543d"; ctx.letterSpacing = "2px"; ctx.font = "italic 28px Georgia"; ctx.fillText("on", center, 1018);
    ctx.fillStyle = "#a87535"; ctx.letterSpacing = "5px"; ctx.font = "700 34px Arial"; ctx.fillText("FRIDAY, 11TH DECEMBER 2026", center, 1072);
    ctx.fillStyle = "#76543d"; ctx.letterSpacing = "2px"; ctx.font = "italic 28px Georgia"; ctx.fillText("at", center, 1125);
    ctx.fillStyle = "#966639"; ctx.letterSpacing = "4px"; ctx.font = "44px Georgia"; ctx.fillText("GRAND MONARCH", center, 1193); ctx.font = "700 29px Arial"; ctx.fillText("THALAWATHUGODA", center, 1243);
    ctx.fillStyle = "#6b4734"; ctx.letterSpacing = "2px"; ctx.font = "italic 33px Georgia"; ctx.fillText("Your presence and blessings will make this occasion truly special.", center, 1335);
    ctx.fillStyle = "#6f513f"; ctx.letterSpacing = "4px"; ctx.font = "32px Georgia"; ctx.fillText("RSVP", center, 1445); ctx.letterSpacing = "2px"; ctx.font = "29px Georgia"; ctx.fillText("CHATHURANGA - 077 3671887", center, 1505); ctx.fillText("VINURI - 077 3678601", center, 1555);
    const link = document.createElement("a"); link.download = "Chathuranga-and-Vinuri-Wedding-Invitation.png"; link.href = canvas.toDataURL("image/png"); link.click();
  }
