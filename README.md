# CorporateSite

## メンバー追加

`img/member/<member-id>/` に `desc.yaml` と画像を配置してから、下記を実行します。

```sh
node scripts/build-members.js
```

構成例:

```text
img/member/genta/
  desc.yaml
  image.png
```

`desc.yaml`:

```yaml
name: げんた
role: 畑の管理・収穫
order: 1
intro: |
  作物の状態を見ながら、日々の畑の管理と収穫を担当しています。
```

画像ファイルは `image.png`, `image.jpg`, `image.jpeg`, `image.webp`, `image.avif` のいずれかを推奨します。

## 商品追加

`img/item/<item-id>/` に `desc.yaml` と画像を配置してから、下記を実行します。

```sh
node scripts/build-items.js
```

構成例:

```text
img/item/onion/
  desc.yaml
  image.jpg
```

`desc.yaml`:

```yaml
name: たまねぎ
label: Vegetable
order: 1
featured: true
intro: |
  料理の土台になる甘みを、島の畑から。
```

`featured: true` にすると、トップページの「旬のおすすめ」に表示されます。商品ページには全商品が表示されます。

## 画像ディレクトリ

- `img/item/`: 商品画像。商品ごとにディレクトリを分けます。
- `img/member/`: つくり手画像。メンバーごとにディレクトリを分けます。
- `img/slider/`: メインビジュアル用のスライダー画像。
- `img/farm/`: 畑・収穫・実績など、汎用的な農園写真。
- `assets/img/decor/`: 和紙背景、葉、罫線、線画などの装飾素材。
