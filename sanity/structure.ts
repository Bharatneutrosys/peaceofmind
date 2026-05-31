import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Traveller's Diary")
    .items([
      S.listItem()
        .title('Site Setup')
        .child(
          S.list()
            .title('Site Setup')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Site Settings'),
                ),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Travel Content')
        .child(
          S.list()
            .title('Travel Content')
            .items([
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('destination').title('Destinations'),
              S.documentTypeListItem('essay').title('Essays / Travel Stories'),
              S.documentTypeListItem('photoJournal').title('Photo Journals'),
              S.documentTypeListItem('video').title('Videos'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Homepage Featured Content')
        .child(
          S.list()
            .title('Homepage Featured Content')
            .items([
              S.listItem()
                .title('Featured Essays')
                .child(
                  S.documentList()
                    .title('Featured Essays')
                    .schemaType('essay')
                    .filter('*[_type == "essay" && featured == true] | order(coalesce(publishedAt, date) desc, title asc)'),
                ),
              S.listItem()
                .title('Featured Destinations')
                .child(
                  S.documentList()
                    .title('Featured Destinations')
                    .schemaType('destination')
                    .filter('*[_type == "destination" && featured == true] | order(coalesce(order, 9999) asc, title asc)'),
                ),
              S.listItem()
                .title('Featured Videos')
                .child(
                  S.documentList()
                    .title('Featured Videos')
                    .schemaType('video')
                    .filter('*[_type == "video" && featured == true] | order(coalesce(publishedAt, _createdAt) desc, title asc)'),
                ),
            ]),
        ),
    ])
