import { Component, OnDestroy, OnInit } from '@angular/core';

import { SnippetResource, Snippet } from '../../services/resources/snippet.resource';

import { ResourceModel } from 'ngx-resource-factory/resource/resource-model';
import { Observable, Subscription } from "rxjs";
import { SetActiveSnippet } from "../../state/snippet/snippet.actions";
import { Select, Store } from "@ngxs/store";


@Component({
  selector: 'app-snippets',
  templateUrl: './snippets.component.html',
  styleUrls: ['./snippets.component.scss']
})
export class SnippetsComponent implements OnInit, OnDestroy {

  activeSnippet: Snippet = null;
  snippets: Snippet[] = [];

  snippetsLoadedSubscription: Subscription;
  activeSnippetSubscription: Subscription;
  activeSnippetDeletedSubscription: Subscription;

  @Select(state => state.snippet.activeSnippet) activeSnippet$: Observable<Snippet>;
  @Select(state => state.snippet.list) snippetList$: Observable<Snippet[]>;

  constructor(private snippetResource: SnippetResource,
              private store: Store) { }

  ngOnInit() {
    /**
     * Initial load
     */
    this.snippetsLoadedSubscription = this.snippetList$.subscribe((snippets) => {
      this.snippets = snippets;
    });

    /**
     * Snippet updated subscription
     */
    this.activeSnippetSubscription = this.activeSnippet$.subscribe((snippet) => {
      this.activeSnippet = snippet;

      // Update snippet in list
      if (snippet) {
        const oldSnippet = this.snippets.find(item => item.pk === snippet.pk);
        if (oldSnippet) {
          this.snippets.splice(this.snippets.indexOf(oldSnippet), 1, this.snippetResource.create(snippet));
        }
      }
    });
  }

  loadSnippet(snippet: ResourceModel<Snippet>) {
    this.store.dispatch(new SetActiveSnippet(snippet));
  }

  ngOnDestroy() {
    this.snippetsLoadedSubscription.unsubscribe();
    this.activeSnippetSubscription.unsubscribe();
    this.activeSnippetDeletedSubscription.unsubscribe();
  }
}
