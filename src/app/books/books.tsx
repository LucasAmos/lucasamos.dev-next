import BooksView from "@/components/books";

export default function Books({
  books,
  finished,
  inprogress
}: {
  books: any;
  finished: any;
  inprogress: any;
}): React.JSX.Element {
  return (
    <div style={{ backgroundColor: "white" }}>
      {/* <h1 className="mb-5 font-Inter text-2xl">
        So far this year I have finished <span className="text-t-violet"> {finished} </span>
        {finished == 1 ? "book" : "books"} and I am currently reading{" "}
        <span className="text-t-violet"> {inprogress} </span> {inprogress == 1 ? "book" : "books"}
      </h1> */}
      <BooksView books={books} />
    </div>
  );
}
