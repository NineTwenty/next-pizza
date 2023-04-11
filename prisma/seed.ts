import type { Prisma } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      categoryName: 'Пицца',
    },
    {
      categoryName: 'Комбо',
    },
    {
      categoryName: 'Закуски',
    },
    {
      categoryName: 'Десерты',
    },
    {
      categoryName: 'Напитки',
    },
    {
      categoryName: 'Соусы',
      listed: false,
    },
  ] satisfies Prisma.CategoryCreateManyInput[];

  await prisma.category.createMany({
    data: categories,
  });

  const toppings: Prisma.ToppingCreateManyInput[] = [
    { id: 1, toppingName: 'Сырный бортик', price: 180 },
    { id: 2, toppingName: 'Моцарелла', price: 99 },
    { id: 3, toppingName: 'Халапеньо', price: 70 },
    { id: 4, toppingName: 'Пепперони', price: 99 },
    { id: 5, toppingName: 'Ветчина', price: 99 },
    { id: 6, toppingName: 'Шампиньоны', price: 70 },
    { id: 7, toppingName: 'Маринованные огурцы', price: 70 },
    { id: 8, toppingName: 'Бекон', price: 99 },
    { id: 9, toppingName: 'Томаты', price: 70 },
    { id: 10, toppingName: 'Брынза', price: 99 },
    { id: 11, toppingName: 'Красный лук', price: 70 },
    { id: 12, toppingName: 'Ананасы', price: 70 },
    { id: 13, toppingName: 'Сладкий перец', price: 70 },
  ];

  const toppingsIdObjectCollection = toppings.map(({ id }) => ({
    id,
  }));

  await prisma.topping.createMany({
    data: toppings,
  });

  const ingredients = [
    { id: 1, ingredientName: 'моцарелла' },
    {
      id: 2,
      ingredientName: 'увеличенная порция моцареллы',
      included: true,
      optional: false,
    },
    {
      id: 3,
      ingredientName: 'фирменный томатный соус',
      included: true,
      optional: false,
    },
    { id: 4, ingredientName: 'соус карри' },
    {
      id: 5,
      ingredientName: 'маринованные огурцы',
      included: true,
      optional: true,
    },
    { id: 6, ingredientName: 'ветчина', optional: true },
    { id: 7, ingredientName: 'чеснок', optional: true },
    { id: 8, ingredientName: 'пепперони', optional: true },
    { id: 9, ingredientName: 'томаты', optional: true },
    { id: 10, ingredientName: 'цыпленок', optional: true },
    {
      id: 11,
      ingredientName: 'красный лук',
      included: true,
      optional: true,
    },
    { id: 12, ingredientName: 'ананасы', optional: true },
    {
      id: 13,
      ingredientName: 'сладкий перец',
      included: true,
      optional: true,
    },
    { id: 14, ingredientName: 'соус ранч' },
  ] satisfies Prisma.IngredientCreateManyInput[];

  await prisma.ingredient.createMany({
    data: ingredients,
  });

  const products = [
    {
      productName: 'Пепперони',
      variations: {
        create: [
          { price: 419, size: 'Маленькая', weight: '400г' },
          { price: 629, size: 'Средняя', weight: '580г' },
          { price: 749, size: 'Большая', weight: '760г' },
        ],
      },
      ingredients: {
        connect: ingredients
          .filter(({ id }) => id === 8 || id === 2 || id === 3)
          .map(({ id }) => ({
            id,
          })),
      },
      toppings: {
        connect: toppingsIdObjectCollection,
      },
    },
    {
      productName: 'Цыпленок ранч',
      variations: {
        create: [
          { price: 489, size: 'Маленькая', weight: '430г' },
          { price: 739, size: 'Средняя', weight: '650г' },
          { price: 889, size: 'Большая', weight: '890г' },
        ],
      },
      ingredients: {
        connect: ingredients
          .filter(
            ({ id }) =>
              id === 10 ||
              id === 6 ||
              id === 14 ||
              id === 1 ||
              id === 9 ||
              id === 7
          )
          .map(({ id }) => ({
            id,
          })),
      },
      toppings: {
        connect: toppingsIdObjectCollection,
      },
    },
  ] satisfies Prisma.ProductCreateInput[];

  await Promise.all(
    products.map(async (product) => {
      await prisma.product.create({ data: product });
    })
  );

  await prisma.menuPosition.create({
    data: {
      menuPositionName: 'Пепперони',
      category: {
        connect: { id: 1 },
      },
    },
  });

  await prisma.menuPosition_Category.create({
    data: {
      category: { connect: { id: 1 } },
      menuPosition: { connect: { menuPositionName: 'Пепперони' } },
      products: { connect: [{ productName: products[0]?.productName }] },
      defaultProduct: { connect: { productName: products[0]?.productName } },
    },
  });

  await prisma.menuPosition.create({
    data: {
      menuPositionName: 'Цыпленок ранч',
      category: {
        connect: { id: 1 },
      },
    },
  });

  await prisma.menuPosition_Category.create({
    data: {
      category: { connect: { id: 1 } },
      menuPosition: { connect: { menuPositionName: 'Цыпленок ранч' } },
      products: { connect: [{ productName: products[1]?.productName }] },
      defaultProduct: { connect: { productName: products[1]?.productName } },
    },
  });

  await prisma.menuPosition.create({
    data: {
      menuPositionName: '2 пиццы',
      description: '2 средние пиццы. Пиццы в комбо можно менять',
      category: {
        connect: { id: 2 },
      },
    },
  });

  await prisma.categoryDiscount.create({
    data: {
      discountSize: 5,
      category: { connect: { id: 2 } },
    },
  });

  await prisma.menuPosition_Category.create({
    data: {
      category: { connect: { id: 2 } },
      menuPosition: { connect: { menuPositionName: '2 пиццы' } },
      products: {
        connect: [
          { productName: products[0]?.productName },
          { productName: products[1]?.productName },
        ],
      },
      defaultProduct: { connect: { id: 1 } },
      categoryDiscount: { connect: { id: 1 } },
    },
  });

  await prisma.menuPosition_Category.create({
    data: {
      category: { connect: { id: 2 } },
      menuPosition: { connect: { menuPositionName: '2 пиццы' } },
      products: {
        connect: [
          { productName: products[0]?.productName },
          { productName: products[1]?.productName },
        ],
      },
      defaultProduct: { connect: { productName: products[1]?.productName } },
      categoryDiscount: { connect: { id: 1 } },
    },
  });
}

main()
  // eslint-disable-next-line promise/always-return
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
