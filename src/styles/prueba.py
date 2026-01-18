# Crear una calculadora de 2 numeros
class Calculadora:
    def __init__(self, num1, num2):
        self.num1 = num1
        self.num2 = num2

    def suma(self):
        return self.num1 + self.num2

    def resta(self):
        return self.num1 - self.num2

    def multiplicacion(self):
        return self.num1 * self.num2

    def division(self):
        return self.num1 / self.num2


# Ejemplo de uso
num1 = int(input("Ingrese el primer numero: "))
num2 = int(input("Ingrese el segundo numero: "))

calc = Calculadora(num1, num2)

print("El resultado de la suma es:", calc.suma())
print("El resultado de la resta es:", calc.resta())
print("El resultado de la multiplicación es:", calc.multiplicacion())
