export default function DynamicBackground({ timeOfDay }: { timeOfDay: string }) {
    const getGradient = () => {
        switch (timeOfDay) {
          case 'morning':
            return 'from-orange-300 via-pink-200 to-blue-200';
          case 'afternoon':
            return 'from-blue-200 via-cyan-200 to-yellow-200';
          case 'night':
            return 'from-blue-900 via-indigo-500 to-purple-900';
          
        }
      };
    
    return (
        <>
        <div 
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-screen h-[250px] -z-10 bg-gradient-to-br ${getGradient()}`}
        style={{
          clipPath: 'inset(0 calc(50vw - 12rem) 0 calc(50vw - 12rem))',
        }}
        />
        <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-screen h-screen -z-30 bg-secondary-600`}
        style={{
          clipPath: 'inset(0 calc(50vw - 12rem) 0 calc(50vw - 12rem))',
        }}
        />
        <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-screen h-[600px] -z-20 bg-secondary-500`}
        style={{
          clipPath: 'inset(0 calc(50vw - 12rem) 0 calc(50vw - 12rem))',
        }}
        />
        <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-screen h-[550px] -z-10 bg-secondary-300`}
        style={{
          clipPath: 'inset(0 calc(50vw - 12rem) 0 calc(50vw - 12rem))',
        }}
        />
        </>
        
    )
}