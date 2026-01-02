export function BoardBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-lg">
      {/* Placeholder for board background image */}
      <div className="h-full w-full bg-gradient-to-br from-ouija-wood to-ouija-dark">
        {/* Board artwork would go here */}
        <svg
          viewBox="0 0 800 600"
          className="h-full w-full opacity-80"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Arc - Letters A-M */}
          <text
            x="400"
            y="150"
            textAnchor="middle"
            className="fill-ouija-gold font-spooky text-4xl"
          >
            A B C D E F G H I J K L M
          </text>

          {/* Bottom Arc - Letters N-Z */}
          <text
            x="400"
            y="450"
            textAnchor="middle"
            className="fill-ouija-gold font-spooky text-4xl"
          >
            N O P Q R S T U V W X Y Z
          </text>

          {/* Numbers */}
          <text
            x="400"
            y="300"
            textAnchor="middle"
            className="fill-ouija-gold font-vintage text-2xl"
          >
            1 2 3 4 5 6 7 8 9 0
          </text>

          {/* YES / NO */}
          <text
            x="100"
            y="200"
            className="fill-ouija-gold font-spooky text-3xl"
          >
            YES
          </text>
          <text
            x="650"
            y="200"
            className="fill-ouija-gold font-spooky text-3xl"
          >
            NO
          </text>

          {/* GOODBYE */}
          <text
            x="400"
            y="550"
            textAnchor="middle"
            className="fill-ouija-gold font-spooky text-3xl"
          >
            GOODBYE
          </text>
        </svg>
      </div>
    </div>
  );
}
