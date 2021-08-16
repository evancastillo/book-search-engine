import React from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { QUERY_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const { loading, data: userData } = useQuery(QUERY_ME);
  const [deleteBook] = useMutation(REMOVE_BOOK);

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    document.location.replace('/')
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await deleteBook({
        variables: { bookId }
      });

      // upon success, remove book's id from localStorage
      removeBookId(bookId);

    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  const user = userData.me;
 
  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {user.savedBooks.length
            ? `Viewing ${user.savedBooks.length} saved ${user.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {user.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <a href={book.link} target="_blank" rel="noopener noreferrer"><Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /></a> : null}
                <Card.Body>
                  <Card.Title><a href={book.link} target="_blank" rel="noopener noreferrer">{book.title}</a></Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
