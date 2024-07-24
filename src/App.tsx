import ProductListPage from "./pages/product-list-page";
import ProductDetailPage from "./pages/product-detail-page";
import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home-page";
import { SideMenu } from "./components/side-menu";

function App() {
  return (
    <>
      <nav className="shadow-lg h-14 mb-6">
        <div className="container h-full flex items-center justify-between">
          <ul className="h-full flex gap-4 items-center ">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
          </ul>
          <SideMenu />
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Routes>
    </>
  );
}

export default App;
