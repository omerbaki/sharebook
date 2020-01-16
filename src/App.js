import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from './pages/Home';
import BooksPage from './pages/Books';
import BookmarksPage from './pages/Bookmarks';


export default function BasicExample() {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/my-books/:bookId" component={BookmarksPage} />
          <Route path="/my-books" component={BooksPage} />
        </Switch>
    </Router>
  );
}