import StudentHeader from "@/components/header/student-header/StudentHeader";

type ShoppingCartProps = {
  children: React.ReactNode;
}

export default function ShoppingCartLayout({children}: ShoppingCartProps) {
  const contentName: string = "Shopping Cart";

  return (
    <main>
      <StudentHeader contentName={contentName} />
      {children}
    </main>
  )
}