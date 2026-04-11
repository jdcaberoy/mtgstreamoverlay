export default function CardPreviewColumn({ state }) {
  const { cardImage, cardName } = state;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      <div style={secTitle}>Card Overlay Preview</div>

      <div style={{
        flex:1,
        background:'#00ff00',
        borderRadius:10,
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        overflow:'hidden',
        position:'relative',
        gap:10,
        padding:12,
      }}>
        {/* Chroma label */}
        <div style={{ position:'absolute', top:8, left:8, fontSize:9, fontWeight:700, color:'rgba(0,0,0,0.25)', letterSpacing:1.5, textTransform:'uppercase' }}>
          CHROMA KEY #00FF00
        </div>

        {cardImage ? (
          <>
            <img
              src={cardImage}
              alt={cardName}
              style={{ maxHeight:'calc(100% - 60px)', maxWidth:'100%', borderRadius:10, boxShadow:'0 4px 20px rgba(0,0,0,0.4)' }}
            />
            {cardName && (
              <div style={{
                color:'white', fontSize:14, fontWeight:700,
                textShadow:'0 2px 8px rgba(0,0,0,0.7)',
                background:'rgba(0,0,0,0.35)',
                padding:'4px 16px', borderRadius:20, flexShrink:0,
                fontFamily:"'Inter',sans-serif",
              }}>
                {cardName}
              </div>
            )}
          </>
        ) : (
          <div style={{ color:'rgba(0,0,0,0.2)', fontSize:13, fontFamily:'sans-serif', textAlign:'center' }}>
            No card selected.<br/>Search or click a card from the deck list.
          </div>
        )}
      </div>
    </div>
  );
}

const secTitle = { fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:1.5, borderBottom:'1px solid #ebebeb', paddingBottom:8, marginBottom:12 };
