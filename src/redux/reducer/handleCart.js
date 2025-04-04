const initialState = {
  items: [],
};

const handleCart = (state = initialState, action) => {
  switch (action.type) {
    case 'ADDITEM':
      const product = action.payload;
      const exist = state.items.find((x) => x.maSanPham === product.maSanPham);
      if (exist) {
        return {
          ...state,
          items: state.items.map((x) =>
            x.maSanPham === product.maSanPham ? { ...x, qty: x.qty + 1 } : x
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...product, qty: 1 }],
        };
      }
    case 'DELITEM':
      const exist2 = state.items.find((x) => x.maSanPham === action.payload.maSanPham);
      if (exist2.qty === 1) {
        return {
          ...state,
          items: state.items.filter((x) => x.maSanPham !== exist2.maSanPham),
        };
      } else {
        return {
          ...state,
          items: state.items.map((x) =>
            x.maSanPham === action.payload.maSanPham ? { ...x, qty: x.qty - 1 } : x
          ),
        };
      }
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};

export default handleCart;