export interface FillInTheBlankQuestion {
  id: string;
  sentence: string;
  answer: string;
  options: string[];
}

export const fillInTheBlankQuestions: FillInTheBlankQuestion[] = [
  {
    id: "1",
    sentence: "Python'da bir liste oluşturmak için köşeli parantezler kullanılır: [1, 2, 3]",
    answer: "liste",
    options: ["liste", "sözlük", "demet", "küme"]
  },
  {
    id: "2",
    sentence: "Bir fonksiyonu tanımlamak için 'def' anahtar kelimesi kullanılır.",
    answer: "def",
    options: ["def", "function", "define", "func"]
  },
  {
    id: "3",
    sentence: "Bir döngü içinde kullanılan 'break' ifadesi, döngüyü sonlandırır.",
    answer: "break",
    options: ["break", "continue", "return", "exit"]
  },
  {
    id: "4",
    sentence: "Bir sınıfın yapıcı metodu '__init__' olarak adlandırılır.",
    answer: "__init__",
    options: ["__init__", "constructor", "init", "setup"]
  },
  {
    id: "5",
    sentence: "Bir dosyayı açmak için 'open()' fonksiyonu kullanılır.",
    answer: "open",
    options: ["open", "read", "file", "load"]
  }
]; 