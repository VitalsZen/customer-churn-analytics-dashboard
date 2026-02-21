
# Đồ án: Phân tích và Dự đoán Khả năng Rời bỏ của Khách hàng trong Thương mại Điện tử

**Trường:** Đại học Công nghệ Thông tin - ĐHQG TPHCM  
**Khoa:** Khoa học và Kỹ thuật Thông tin  
**Môn học:** Phân tích và Trực quan dữ liệu (IE313.Q11)


### **1.  Giới thiệu**

Đồ án này thực hiện một quy trình khoa học dữ liệu toàn diện nhằm giải quyết bài toán **dự đoán khả năng rời bỏ của khách hàng (Customer Churn)** trong lĩnh vực thương mại điện tử. Việc giữ chân khách hàng là yếu tố sống còn đối với các doanh nghiệp, và khả năng dự đoán sớm các khách hàng có nguy cơ rời bỏ cho phép doanh nghiệp triển khai các chiến lược can thiệp chủ động và hiệu quả.

Dự án sử dụng bộ dữ liệu _"Ecommerce Customer Churn Analysis and Prediction"_ từ Kaggle, áp dụng các kỹ thuật từ tiền xử lý, phân tích dữ liệu khám phá (EDA), kỹ thuật đặc trưng, đến xây dựng và so sánh **8 mô hình học máy** khác nhau. Kết quả cuối cùng không chỉ là một mô hình dự đoán có độ chính xác cao mà còn là một **hệ thống dashboard tương tác** và **sản phẩm demo**, giúp chuyển hóa dữ liệu thành các insight kinh doanh có giá trị.

### **2.  Mục tiêu của Đồ án**

Đồ án này được thực hiện nhằm đạt được ba mục tiêu chính:

*   **Phân tích và xác định** các yếu tố chính ảnh hưởng đến quyết định rời bỏ của khách hàng.
*   **Xây dựng và so sánh** các mô hình học máy để lựa chọn ra mô hình có hiệu suất dự đoán tốt nhất.
*   **Đề xuất các giải pháp kinh doanh** khả thi dựa trên những insight đã phân tích để giảm tỷ lệ Churn.

### **3.  Cấu trúc Thư mục**

Dự án được tổ chức theo cấu trúc sau để đảm bảo tính rõ ràng và khả năng tái sử dụng:

```
.
├── 1.Dataset/       # Chứa dữ liệu thô và dữ liệu đã được làm sạch (.csv)
├── 2.Preprocessing/ # Chứa notebook cho quá trình tiền xử lý dữ liệu
├── 3.EDA/           # Chứa notebook cho quá trình phân tích dữ liệu khám phá
├── 4.Visualization/ # Chứa các sản phẩm trực quan hóa (file .pbix, link Flourish, source code & link website)
├── 5.Modeling/      # Chứa notebook cho quá trình xây dựng và đánh giá mô hình
├── 6.Report/        # Chứa file báo cáo cuối kỳ của đồ án
└── README.md        # File mô tả tổng quan về dự án
```


### **4.  Quy trình Thực hiện**

#### **4.1. Tiền xử lý Dữ liệu**

*   **Làm sạch dữ liệu không nhất quán:** Chuẩn hóa các giá trị hạng mục (ví dụ: "Phone" và "Mobile Phone").
*   **Xử lý giá trị thiếu:** Áp dụng các chiến lược điền dữ liệu phù hợp với từng biến (trung vị, điền có điều kiện).
*   **Xử lý ngoại lai:** Sử dụng phương pháp **IQR** và kỹ thuật **capping** để xử lý các giá trị bất thường.

#### **4.2. Phân tích Dữ liệu Khám phá (EDA)**

*   Thực hiện **phân tích đơn biến và đa biến** để tìm ra các xu hướng, mẫu và insight quan trọng liên quan đến hành vi rời bỏ.
*   Các kết quả phân tích được trực quan hóa bằng hệ thống **dashboard trên Power BI**.

#### **4.3. Kỹ thuật & Lựa chọn Đặc trưng**

*   **Tạo đặc trưng mới:** Xây dựng biến `DevicePerTenure` để đo lường tốc độ tiếp nhận công nghệ của khách hàng.
*   **Lựa chọn đặc trưng:** Sử dụng kết hợp **Ma trận tương quan**, **Kiểm định Chi-squared** và hệ số **Cramér's V** để loại bỏ 5 cột không cần thiết, nhằm giảm đa cộng tuyến và nhiễu.

#### **4.4. Xây dựng Mô hình**

*   **Xây dựng và so sánh 8 mô hình khác nhau:** Logistic Regression, KNN, SVM, Random Forest, Gradient Boosting, **XGBoost**, **LightGBM**, và MLP.
*   Sử dụng **Pipeline** để tự động hóa quy trình chuẩn hóa (`StandardScaler`) và mã hóa (`OneHotEncoder`).
*   Áp dụng các kỹ thuật xử lý dữ liệu mất cân bằng: `class_weight` và **SMOTE**.
*   Đánh giá mô hình một cách khách quan bằng **Kiểm định chéo phân tầng 10 lần** (10-fold Stratified Cross-Validation).

#### **4.5. Đánh giá Mô hình**

*   Sử dụng các độ đo toàn diện: `Accuracy`, `ROC-AUC`, và đặc biệt tập trung vào **`F1-Score`**, **`Precision`**, **`Recall`** cho lớp Churn (C1) để đánh giá hiệu quả kinh doanh.



### **5.  Kết quả nổi bật**

 **Insight chính từ EDA:** Tỷ lệ rời bỏ cao đột biến ở nhóm khách hàng mới (0-6 tháng), nhóm mua ngành hàng "Thời trang", và đặc biệt là nhóm có khiếu nại.

 **Mô hình Tốt nhất: XGBoost** được xác định là mô hình hiệu quả nhất.

**Hiệu suất của XGBoost:**

*   **Accuracy:** `0.99`
*   **F1-Score (lớp Churn):** `0.96`
*   **Recall (lớp Churn):** `0.95`
*   **AUC:** `0.995`

### **6.  Sản phẩm Trực quan hóa**

*   **Power BI Dashboard:** Một hệ thống gồm **5 trang báo cáo tương tác**, cung cấp cái nhìn 360 độ về bài toán Churn, từ tổng quan điều hành đến phân tích hiệu suất mô hình.
*   [**Flourish Data Story:**](https://public.flourish.studio/story/3520181/) Một câu chuyện dữ liệu kể về "hành trình rời bỏ" của khách hàng, sử dụng các biểu đồ ấn tượng như **Parliament Chart** và **Sankey Diagram**.
*   [**Website Demo:**](https://pttqdl-webdemo.vercel.app/) Một ứng dụng web (xây dựng bằng **React & TypeScript**) cho phép người dùng tự tải lên file CSV và tạo các biểu đồ phân tích một cách linh hoạt.

### **7.  Thông tin liên lạc**

*   **Giảng viên hướng dẫn:** ThS. Phạm Nguyễn Phúc Toàn - `toanpnp@uit.edu.vn`
*   **Thành viên nhóm:**
    *   Phạm Huỳnh Tấn Khang - `22520624@gm.uit.edu.vn`
    *   Huỳnh Ngọc Trang - `22521510@gm.uit.edu.vn`
    *   Nguyễn Huỳnh Xuân Nghi - `23521004@gm.uit.edu.vn`
    *   Nguyễn Thị Ngọc Phước - `23521235@gm.uit.edu.vn`
