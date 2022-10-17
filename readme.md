* Độ khó: 200
* các chức năng của trang web: 
  1. Thêm một sản phẩm 
  2. Mua sản phẩm, trong danh sách sản phẩm có sản phẩm chứa flag
  3. Thêm tiền vào tài khoản khi là admin
* chức năng thêm sản phẩm bị lỗi prototype pollution:
```for (const [k, v] of Object.entries(value)) {
            if (k === 'quantity') {
                phones[key][k] += v;
            } else {
                phones[key][k] = v;
            }
        }
```
Khi **k** khác **quantity** thì khi gửi json có `{'__proto__': {'admin': 'true'}}` khiến mọi object tồn tại trong ứng dụng có thuộc tính **admin** có giá trị **true**.
* Khai thác lỗ hổng
   1. lên admin bằng cách gửi `{'__proto__': {'admin': 'true'}, 'xiaomi': { 'quantity': 1 }}`  lên endpoint **/sell**.
   2. thêm tiền vào tài khoản: `{ 'money': 10000 }` để đủ tiền mua **flag**.
   3. Mua flag khi đã có đủ tiền.


