import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from './pages/Home';
import BooksPage from './pages/Books';
import BookmarksPage from './pages/Bookmarks';


export default function BasicExample() {
  return (
    <Router>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Route path="/my-books">
            <BooksPage />
          </Route>
          <Route path="/my-books/:bookId">
            <BookmarksPage />
          </Route>
        </Switch>
    </Router>
  );
}