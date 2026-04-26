export function MeshGradient() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float-slow 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] rounded-full opacity-15"
        style={{
          background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float-medium 15s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "float-fast 10s ease-in-out infinite",
        }}
      />
    </div>
  );
}
