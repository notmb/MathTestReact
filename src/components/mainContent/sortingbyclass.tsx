import "./sortingbytopic.css";

const SortingByClass = () => {
  const topics = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  return (
    <div className="sorting_by_topic">
      {topics.map((item) => (
        <div key={item} className="cards_for_sorting">
          {item} Тема
        </div>
      ))}
    </div>
  );
};
export default SortingByClass;
