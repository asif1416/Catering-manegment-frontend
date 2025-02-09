import Image from "next/image";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/types/types"

interface FoodCardsProps {
  cards: MenuItem[];
}

export default function MenuCards({ cards }: FoodCardsProps) {
  const router = useRouter();

  const handleCardClick = (id: number) => {
    router.push(`/menu/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto"
        style={{ maxHeight: "820px" }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(card.id)} 
          >
            <div className="relative h-48">
              <Image
                src={`/images/${card.image}`}
                alt={"Menu Item Image"}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{card.name}</h3>
              <p className="text-gray-600 mb-2">{card.description}</p>
              <p className="text-primary font-bold">${card.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-1">Category: {card.category}</p>
              <p
                className={`text-sm ${
                  card.available ? "text-green-500" : "text-red-500"
                } mt-1`}
              >
                {card.available ? "Available" : "Not Available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
